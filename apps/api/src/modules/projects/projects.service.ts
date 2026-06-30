import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/create-project.dto';
import SwaggerParser from 'swagger-parser';
import axios from 'axios';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.project.findMany({
      where: { userId, isActive: true },
      include: {
        apiSpec: {
          select: { id: true, title: true, version: true, source: true },
        },
        _count: {
          select: { assessments: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
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
    return project;
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
      },
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

    this.logger.log(`Importing OpenAPI spec from URL: ${url}`);

    const response = await axios.get(url, { timeout: 15000 });
    const rawSpec = response.data;

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
      parsed = rawSpec;
    }

    const endpoints = this.extractEndpoints(parsed);

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

    return this.prisma.authConfig.upsert({
      where: { apiSpecId: apiSpec.id },
      update: authData,
      create: { apiSpecId: apiSpec.id, ...authData },
    });
  }

  private async assertOwner(projectId: string, userId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, userId },
    });
    if (!project) throw new ForbiddenException('Project not found or access denied');
    return project;
  }
}
