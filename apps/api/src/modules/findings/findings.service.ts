import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FindingsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, filters?: {
    severity?: string;
    status?: string;
    projectId?: string;
    assessmentId?: string;
    owaspCategory?: string;
  }) {
    return this.prisma.finding.findMany({
      where: {
        assessment: { project: { userId } },
        ...(filters?.severity ? { severity: filters.severity as any } : {}),
        ...(filters?.status ? { status: filters.status as any } : {}),
        ...(filters?.assessmentId ? { assessmentId: filters.assessmentId } : {}),
        ...(filters?.projectId ? { assessment: { projectId: filters.projectId } } : {}),
        ...(filters?.owaspCategory ? { owaspCategory: filters.owaspCategory } : {}),
      },
      include: {
        assessment: {
          select: {
            id: true,
            project: { select: { id: true, name: true } },
          },
        },
        endpoint: { select: { path: true, method: true } },
      },
      orderBy: [{ severity: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async findOne(id: string, userId: string) {
    const finding = await this.prisma.finding.findFirst({
      where: { id, assessment: { project: { userId } } },
      include: {
        assessment: {
          select: {
            id: true,
            project: { select: { id: true, name: true, baseUrl: true } },
          },
        },
        endpoint: true,
      },
    });
    if (!finding) throw new NotFoundException('Finding not found');
    return finding;
  }

  async updateStatus(id: string, userId: string, status: string, notes?: string) {
    const finding = await this.prisma.finding.findFirst({
      where: { id, assessment: { project: { userId } } },
    });
    if (!finding) throw new NotFoundException('Finding not found');

    return this.prisma.finding.update({
      where: { id },
      data: {
        status: status as any,
        notes,
        updatedAt: new Date(),
      },
    });
  }

  async getStats(userId: string) {
    const [bySeverity, byOwasp, byStatus, total] = await Promise.all([
      this.prisma.finding.groupBy({
        by: ['severity'],
        where: { assessment: { project: { userId } } },
        _count: { _all: true },
      }),
      this.prisma.finding.groupBy({
        by: ['owaspCategory'],
        where: { assessment: { project: { userId } } },
        _count: { _all: true },
        orderBy: { _count: { owaspCategory: 'desc' } },
        take: 10,
      }),
      this.prisma.finding.groupBy({
        by: ['status'],
        where: { assessment: { project: { userId } } },
        _count: { _all: true },
      }),
      this.prisma.finding.count({
        where: { assessment: { project: { userId } } },
      }),
    ]);

    return { bySeverity, byOwasp, byStatus, total };
  }
}
