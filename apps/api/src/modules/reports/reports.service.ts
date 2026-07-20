import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, assessmentId?: string) {
    return this.prisma.report.findMany({
      where: {
        assessment: { project: { userId } },
        ...(assessmentId ? { assessmentId } : {}),
      },
      include: {
        assessment: {
          select: {
            id: true,
            project: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { generatedAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const report = await this.prisma.report.findFirst({
      where: { id, assessment: { project: { userId } } },
      include: {
        assessment: {
          select: {
            id: true,
            project: { select: { id: true, name: true } },
            summary: true,
            // Snapshots from the scan this report describes, so the report's
            // content cannot drift as issues are later re-triaged or reworded.
            occurrences: {
              orderBy: [{ severitySnapshot: 'asc' }, { detectedAt: 'desc' }],
              include: { issue: { select: { id: true, status: true } } },
            },
          },
        },
      },
    });
    if (!report) throw new NotFoundException('Report not found');
    return report;
  }

  async findByAssessment(assessmentId: string, userId: string) {
    const assessment = await this.prisma.assessment.findFirst({
      where: { id: assessmentId, project: { userId } },
    });
    if (!assessment) throw new NotFoundException('Assessment not found');

    return this.prisma.report.findMany({
      where: { assessmentId },
      include: {
        assessment: {
          select: {
            id: true,
            project: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { generatedAt: 'desc' },
    });
  }

  async getStats(userId: string) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [totalReports, assessments, projects] = await Promise.all([
      this.prisma.report.count({
        where: { assessment: { project: { userId } } },
      }),
      this.prisma.assessment.findMany({
        where: { project: { userId }, status: 'COMPLETED' },
        include: { summary: true },
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.project.count({ where: { userId, isActive: true } }),
    ]);

    const totalFindings = assessments.reduce(
      (sum, a) => sum + (a.summary?.totalFindings || 0),
      0,
    );
    const criticalCount = assessments.reduce(
      (sum, a) => sum + (a.summary?.criticalCount || 0),
      0,
    );
    const highCount = assessments.reduce(
      (sum, a) => sum + (a.summary?.highCount || 0),
      0,
    );
    const mediumCount = assessments.reduce(
      (sum, a) => sum + (a.summary?.mediumCount || 0),
      0,
    );
    const lowCount = assessments.reduce(
      (sum, a) => sum + (a.summary?.lowCount || 0),
      0,
    );
    // Averages only assessments that actually produced a score.
    //
    // This previously used `|| 100`, which turned a real score of 0 — the worst
    // possible posture — into a perfect 100, and counted scans with no summary
    // as perfect too. Null now means "no score", and is excluded rather than
    // substituted.
    const scored = assessments
      .map((a) => a.summary?.securityScore)
      .filter((score): score is number => typeof score === 'number');

    const avgSecurityScore =
      scored.length > 0
        ? Math.round(scored.reduce((sum, score) => sum + score, 0) / scored.length)
        : null;

    const avgDuration =
      assessments.filter((a) => a.duration).length > 0
        ? Math.round(
            assessments.reduce((sum, a) => sum + (a.duration || 0), 0) /
              assessments.filter((a) => a.duration).length,
          )
        : 0;

    const recentAssessments = assessments.filter(
      (a) => new Date(a.createdAt) >= thirtyDaysAgo,
    );

    const trendMap: Record<
      string,
      { date: string; critical: number; high: number; medium: number; low: number; total: number; score: number }
    > = {};

    for (const a of recentAssessments) {
      const day = new Date(a.createdAt).toISOString().split('T')[0];
      if (!trendMap[day]) {
        trendMap[day] = { date: day, critical: 0, high: 0, medium: 0, low: 0, total: 0, score: 0 };
      }
      trendMap[day].critical += a.summary?.criticalCount || 0;
      trendMap[day].high += a.summary?.highCount || 0;
      trendMap[day].medium += a.summary?.mediumCount || 0;
      trendMap[day].low += a.summary?.lowCount || 0;
      trendMap[day].total += a.summary?.totalFindings || 0;
      // Null when the day's last scan produced no score, rather than 100.
      trendMap[day].score = a.summary?.securityScore ?? null;
    }

    const trend = Object.values(trendMap).sort((a, b) =>
      a.date.localeCompare(b.date),
    );

    return {
      totalReports,
      totalAssessments: assessments.length,
      totalProjects: projects,
      totalFindings,
      criticalCount,
      highCount,
      mediumCount,
      lowCount,
      avgSecurityScore,
      avgDuration,
      trend,
    };
  }

  async createRecord(data: {
    assessmentId: string;
    type: string;
    format: string;
    title: string;
    fileSize?: number;
  }) {
    return this.prisma.report.create({
      data: {
        assessmentId: data.assessmentId,
        type:         data.type   as any,
        format:       data.format as any,
        title:        data.title,
        fileSize:     data.fileSize ?? 0,
        generatedAt:  new Date(),
      },
    });
  }

  async remove(id: string, userId: string) {
    const report = await this.prisma.report.findFirst({
      where: { id, assessment: { project: { userId } } },
    });
    if (!report) throw new NotFoundException('Report not found');

    await this.prisma.report.delete({ where: { id } });
    return { message: 'Report deleted' };
  }
}
