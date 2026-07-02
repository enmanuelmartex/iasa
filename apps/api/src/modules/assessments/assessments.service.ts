import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, Subject } from 'rxjs';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AssessmentsService {
  private readonly logger = new Logger(AssessmentsService.name);
  private progressSubjects = new Map<string, Subject<MessageEvent>>();

  constructor(
    private prisma: PrismaService,
    @InjectQueue('scanner') private scannerQueue: Queue,
    private eventEmitter: EventEmitter2,
  ) {
    this.eventEmitter.on('scanner.progress', (data) => {
      this.emitProgress(data.assessmentId, data);
    });
  }

  async findAll(userId: string, projectId?: string) {
    return this.prisma.assessment.findMany({
      where: {
        project: { userId },
        ...(projectId ? { projectId } : {}),
      },
      include: {
        project: { select: { id: true, name: true, baseUrl: true } },
        summary: true,
        _count: { select: { findings: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const assessment = await this.prisma.assessment.findFirst({
      where: { id, project: { userId } },
      include: {
        project: { select: { id: true, name: true, baseUrl: true, environment: true } },
        config: true,
        summary: true,
        findings: {
          orderBy: [{ severity: 'asc' }, { createdAt: 'desc' }],
        },
        reports: true,
        logs: {
          orderBy: { timestamp: 'asc' },
          take: 500,
        },
      },
    });

    if (!assessment) throw new NotFoundException('Assessment not found');
    return assessment;
  }

  async createAndRun(
    projectId: string,
    userId: string,
    config?: {
      executionMode?: 'all' | 'profile' | 'manual';
      scanProfileId?: string;
      manualPlugins?: string[];
      enableAiAnalysis?: boolean;
      maxRequestsPerEndpoint?: number;
      requestDelayMs?: number;
      timeoutMs?: number;
    },
  ) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, userId },
      include: {
        apiSpec: {
          include: { authConfig: true, endpoints: true },
        },
      },
    });

    if (!project) throw new ForbiddenException('Project not found or access denied');
    if (!project.apiSpec) {
      throw new BadRequestException('Please import an OpenAPI specification before running an assessment');
    }
    if (!project.apiSpec.endpoints.length) {
      throw new BadRequestException('No endpoints found in the API specification');
    }

    const assessment = await this.prisma.assessment.create({
      data: {
        projectId,
        status: 'QUEUED',
        config: {
          create: {
            executionMode:          config?.executionMode          ?? 'all',
            scanProfileId:          config?.scanProfileId          ?? null,
            manualPlugins:          config?.manualPlugins          ?? [],
            enableAiAnalysis:       config?.enableAiAnalysis       ?? true,
            maxRequestsPerEndpoint: config?.maxRequestsPerEndpoint ?? 10,
            requestDelayMs:         config?.requestDelayMs         ?? 200,
            timeoutMs:              config?.timeoutMs              ?? 10000,
          },
        },
      },
      include: { config: true },
    });

    const job = await this.scannerQueue.add(
      'run-assessment',
      {
        assessmentId: assessment.id,
        projectId,
        specId: project.apiSpec.id,
        userId,               // required for per-user plugin enable/disable
      },
      { jobId: `assessment-${assessment.id}` },
    );

    await this.prisma.assessment.update({
      where: { id: assessment.id },
      data: { jobId: job.id as string, status: 'QUEUED' },
    });

    this.logger.log(`Assessment ${assessment.id} queued (job: ${job.id})`);
    return assessment;
  }

  async cancel(id: string, userId: string) {
    const assessment = await this.prisma.assessment.findFirst({
      where: { id, project: { userId } },
    });
    if (!assessment) throw new NotFoundException('Assessment not found');

    if (assessment.jobId) {
      const job = await this.scannerQueue.getJob(assessment.jobId);
      await job?.remove();
    }

    return this.prisma.assessment.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }

  streamProgress(assessmentId: string, userId: string): Observable<MessageEvent> {
    const subject = new Subject<MessageEvent>();
    this.progressSubjects.set(assessmentId, subject);

    setTimeout(() => {
      if (this.progressSubjects.has(assessmentId)) {
        this.progressSubjects.get(assessmentId)?.complete();
        this.progressSubjects.delete(assessmentId);
      }
    }, 10 * 60 * 1000);

    return subject.asObservable();
  }

  private emitProgress(assessmentId: string, data: any) {
    const subject = this.progressSubjects.get(assessmentId);
    if (subject) {
      subject.next({ data } as MessageEvent);
    }
  }

  async getDashboardStats(userId: string) {
    const [projects, assessments, findings] = await Promise.all([
      this.prisma.project.count({ where: { userId, isActive: true } }),
      this.prisma.assessment.findMany({
        where: { project: { userId }, status: 'COMPLETED' },
        include: { summary: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      this.prisma.finding.groupBy({
        by: ['severity'],
        where: { assessment: { project: { userId } } },
        _count: { severity: true },
      }),
    ]);

    const findingsBySeverity = findings.reduce(
      (acc, f) => {
        const key = f.severity.toLowerCase();
        acc[key] = (acc[key] || 0) + (f as any)._count.severity;
        return acc;
      },
      {} as Record<string, number>,
    );

    const avgScore =
      assessments.length > 0
        ? assessments.reduce((sum, a) => sum + (a.summary?.securityScore ?? 100), 0) /
          assessments.length
        : 100;

    return {
      totalProjects: projects,
      totalAssessments: assessments.length,
      avgSecurityScore: Math.round(avgScore),
      findings: findingsBySeverity,
      recentAssessments: assessments.slice(0, 5),
    };
  }
}
