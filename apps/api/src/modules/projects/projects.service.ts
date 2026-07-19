import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProjectDto, SaveProjectDraftDto, UpdateProjectDto } from './dto/create-project.dto';
import SwaggerParser = require('swagger-parser');
import axios from 'axios';
import { resolveTargetUrl } from '../../common/utils/url-resolver.util';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    const projects = await this.prisma.project.findMany({
      where: { userId, isActive: true },
      include: {
        apiSpec: {
          include: { authConfig: true },
        },
        _count: {
          select: { assessments: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return projects.map((project) => this.toProjectResponse(project));
  }

  async findOne(id: string, userId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id, userId, isActive: true },
      include: {
        apiSpec: {
          include: {
            authConfig: true,
            endpoints: { orderBy: [{ path: 'asc' }, { method: 'asc' }] },
          },
        },
        assessments: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: {
            summary: true,
          },
        },
        _count: { select: { assessments: true } },
      },
    });

    if (!project) throw new NotFoundException('Project not found');
    return this.toProjectResponse(project);
  }

  async create(userId: string, dto: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        name: dto.name,
        description: dto.description,
        baseUrl: dto.baseUrl,
        environment: dto.environment || 'DEVELOPMENT',
        tags: dto.tags || [],
        userId,
        status: 'DRAFT',
        setupStep: 2,
      },
    });
  }

  async createDraft(userId: string, dto: SaveProjectDraftDto) {
    if (![dto.name, dto.baseUrl, dto.description].some((value) => value?.trim())) {
      throw new BadRequestException({ message: 'Enter project information before saving a draft.', fieldErrors: {} });
    }
    return this.prisma.project.create({
      data: {
        name: dto.name?.trim() || 'Untitled project',
        description: dto.description,
        baseUrl: dto.baseUrl?.trim() || '',
        environment: dto.environment || 'DEVELOPMENT',
        setupStep: dto.setupStep || 1,
        status: 'DRAFT',
        userId,
      },
    });
  }

  async saveDraft(id: string, userId: string, dto: SaveProjectDraftDto) {
    const project = await this.assertOwner(id, userId);
    if (project.status !== 'DRAFT') throw new BadRequestException('Only drafts can be autosaved.');
    return this.prisma.project.update({ where: { id }, data: dto });
  }

  async finalize(id: string, userId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id, userId, isActive: true },
      include: { apiSpec: { include: { authConfig: true } } },
    });
    if (!project) throw new NotFoundException('Project not found');
    if (project.status === 'READY') return project;
    const fieldErrors: Record<string, string> = {};
    if (!project.name.trim()) fieldErrors.name = 'Project name is required.';
    try { new URL(project.baseUrl); } catch { fieldErrors.baseUrl = 'Enter a valid API base URL.'; }
    if (!project.apiSpec) fieldErrors.specUrl = 'Upload a valid OpenAPI JSON or YAML document.';
    else if (!this.isAuthComplete(project.apiSpec.authConfig)) {
      fieldErrors.authType = 'Complete the authentication configuration.';
    }
    if (Object.keys(fieldErrors).length) {
      throw new BadRequestException({ message: 'Complete the required project setup.', fieldErrors });
    }
    return this.prisma.project.update({
      where: { id },
      data: { status: 'READY', setupStep: 3, completedAt: new Date() },
      include: { apiSpec: { select: { id: true, title: true, version: true, source: true } }, _count: { select: { assessments: true } } },
    });
  }

  async update(id: string, userId: string, dto: UpdateProjectDto) {
    await this.assertOwner(id, userId);
    return this.prisma.project.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, userId: string) {
    await this.assertOwner(id, userId);
    return this.prisma.project.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async importOpenApiFromUrl(projectId: string, userId: string, url: string) {
    await this.assertOwner(projectId, userId);

    const resolvedUrl = resolveTargetUrl(url);
    this.logger.log(`Importing OpenAPI spec from URL: ${resolvedUrl}`);

    let rawSpec: any;
    try {
      const response = await axios.get(resolvedUrl, { timeout: 15000 });
      rawSpec = response.data;
    } catch (error) {
      this.logger.warn(`Specification URL import failed: ${error instanceof Error ? error.message : 'unknown error'}`);
      throw new BadRequestException('We could not access the specification URL.');
    }

    return this.parseAndSaveSpec(projectId, rawSpec, 'URL', url);
  }

  async importOpenApiFromContent(
    projectId: string,
    userId: string,
    content: object,
  ) {
    await this.assertOwner(projectId, userId);
    return this.parseAndSaveSpec(projectId, content, 'UPLOAD');
  }

  private async parseAndSaveSpec(
    projectId: string,
    rawSpec: any,
    source: 'URL' | 'UPLOAD' | 'MANUAL',
    url?: string,
  ) {
    let parsed: any;
    try {
      parsed = await SwaggerParser.dereference(rawSpec as any);
    } catch (err) {
      this.logger.warn(`Could not fully dereference spec: ${err.message}`);
      throw new BadRequestException('Upload a valid OpenAPI JSON or YAML document.');
    }

    const endpoints = this.extractEndpoints(parsed);
    if (!parsed?.openapi && !parsed?.swagger) throw new BadRequestException('Upload a valid OpenAPI document.');
    if (!parsed?.paths || endpoints.length === 0) throw new BadRequestException('The specification does not contain any valid endpoints.');

    const apiSpec = await this.prisma.apiSpec.upsert({
      where: { projectId },
      update: {
        source,
        url,
        rawSpec: rawSpec as any,
        parsed: parsed as any,
        title: parsed.info?.title,
        version: parsed.info?.version,
        endpoints: {
          deleteMany: {},
          create: endpoints,
        },
      },
      create: {
        projectId,
        source,
        url,
        rawSpec: rawSpec as any,
        parsed: parsed as any,
        title: parsed.info?.title,
        version: parsed.info?.version,
        endpoints: { create: endpoints },
      },
      include: {
        endpoints: true,
        authConfig: true,
      },
    });

    this.logger.log(
      `Parsed ${endpoints.length} endpoints from spec for project ${projectId}`,
    );

    await this.prisma.project.update({ where: { id: projectId }, data: { setupStep: 3 } });

    return apiSpec;
  }

  private extractEndpoints(spec: any) {
    const endpoints: any[] = [];
    const paths = spec.paths || {};

    for (const [path, pathItem] of Object.entries<any>(paths)) {
      const methods = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options', 'trace'];

      for (const method of methods) {
        if (!pathItem[method]) continue;

        const operation = pathItem[method];
        endpoints.push({
          path,
          method: method.toUpperCase(),
          summary: operation.summary,
          description: operation.description,
          operationId: operation.operationId,
          tags: operation.tags || [],
          parameters: operation.parameters || [],
          requestBody: operation.requestBody || null,
          responses: operation.responses || {},
          security: operation.security || spec.security || [],
          deprecated: operation.deprecated || false,
        });
      }
    }

    return endpoints;
  }

  async saveAuthConfig(
    projectId: string,
    userId: string,
    authData: any,
  ) {
    await this.assertOwner(projectId, userId);

    const apiSpec = await this.prisma.apiSpec.findUnique({ where: { projectId } });
    if (!apiSpec) throw new NotFoundException('API spec not found. Please import a spec first.');

    const allowedTypes = ['NONE', 'BEARER', 'BASIC', 'API_KEY', 'OAUTH2'];
    if (!allowedTypes.includes(authData.type)) throw new BadRequestException('Select a valid authentication type.');
    if (authData.type === 'BEARER' && !authData.token?.trim()) throw new BadRequestException({ message: 'Authentication is incomplete.', fieldErrors: { token: 'A bearer token is required.' } });
    if (authData.type === 'BASIC' && (!authData.username?.trim() || !authData.password)) throw new BadRequestException({ message: 'Authentication is incomplete.', fieldErrors: { username: !authData.username?.trim() ? 'Username is required.' : undefined, password: !authData.password ? 'Password is required.' : undefined } });
    if (authData.type === 'API_KEY' && (!authData.apiKey || !authData.apiKeyHeader?.trim())) throw new BadRequestException({ message: 'Authentication is incomplete.', fieldErrors: { apiKey: !authData.apiKey ? 'An API key is required.' : undefined, apiKeyHeader: !authData.apiKeyHeader?.trim() ? 'Key name is required.' : undefined } });
    if (authData.type === 'OAUTH2' && (!authData.clientId || !authData.clientSecret || !authData.tokenUrl)) throw new BadRequestException('OAuth 2.0 configuration is incomplete.');
    const safeAuthData = Object.fromEntries(Object.entries(authData).filter(([key]) => ['type', 'token', 'username', 'password', 'apiKey', 'apiKeyHeader', 'apiKeyLocation', 'clientId', 'clientSecret', 'tokenUrl', 'scopes'].includes(key)));

    const result = await this.prisma.authConfig.upsert({
      where: { apiSpecId: apiSpec.id },
      update: safeAuthData,
      create: { apiSpecId: apiSpec.id, ...safeAuthData } as any,
    });
    await this.prisma.project.update({ where: { id: projectId }, data: { setupStep: 3 } });
    return result;
  }

  private async assertOwner(projectId: string, userId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, userId },
    });
    if (!project) throw new ForbiddenException('Project not found or access denied');
    return project;
  }

  private toProjectResponse<T extends { name: string; baseUrl: string; status: string; setupStep: number; apiSpec?: any }>(project: T) {
    const firstIncompleteStep = this.getFirstIncompleteStep(project);
    const apiSpec = project.apiSpec
      ? { ...project.apiSpec, authConfig: this.sanitizeAuthConfig(project.apiSpec.authConfig) }
      : project.apiSpec;
    return {
      ...project,
      apiSpec,
      setupStep: project.status === 'DRAFT' ? firstIncompleteStep ?? 3 : 3,
    };
  }

  private getFirstIncompleteStep(project: { name: string; baseUrl: string; apiSpec?: any }): 1 | 2 | 3 | null {
    if (!project.name.trim() || !this.isValidUrl(project.baseUrl)) return 1;
    if (!project.apiSpec) return 2;
    if (!this.isAuthComplete(project.apiSpec.authConfig)) return 3;
    return null;
  }

  private isValidUrl(value: string) {
    try { new URL(value); return true; } catch { return false; }
  }

  private isAuthComplete(authConfig?: any) {
    if (!authConfig) return false;
    if (authConfig.type === 'NONE') return true;
    if (authConfig.type === 'BEARER') return Boolean(authConfig.token?.trim());
    if (authConfig.type === 'BASIC') return Boolean(authConfig.username?.trim() && authConfig.password);
    if (authConfig.type === 'API_KEY') return Boolean(authConfig.apiKey && authConfig.apiKeyHeader?.trim());
    if (authConfig.type === 'OAUTH2') return Boolean(authConfig.clientId && authConfig.clientSecret && this.isValidUrl(authConfig.tokenUrl ?? ''));
    return false;
  }

  private sanitizeAuthConfig(authConfig?: any) {
    if (!authConfig) return authConfig;
    const { token: _token, password: _password, apiKey: _apiKey, clientId: _clientId, clientSecret: _clientSecret, customHeaders: _customHeaders, ...safe } = authConfig;
    return safe;
  }
}
