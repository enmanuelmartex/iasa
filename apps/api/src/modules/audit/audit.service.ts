import { Injectable, Logger } from '@nestjs/common';
import { AuditAction } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

interface LogParams {
  userId?: string;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  success?: boolean;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private prisma: PrismaService) {}

  log(params: LogParams): void {
    this.prisma.auditLog
      .create({
        data: {
          userId: params.userId,
          action: params.action,
          resource: params.resource,
          resourceId: params.resourceId,
          metadata: params.metadata,
          ipAddress: params.ipAddress,
          userAgent: params.userAgent,
          success: params.success ?? true,
        },
      })
      .catch((err) => this.logger.error('Failed to write audit log', err));
  }

  async findAll(opts?: {
    userId?: string;
    action?: AuditAction;
    resource?: string;
    limit?: number;
    offset?: number;
  }) {
    const where: any = {};
    if (opts?.userId)   where.userId   = opts.userId;
    if (opts?.action)   where.action   = opts.action;
    if (opts?.resource) where.resource = opts.resource;

    const [total, items] = await Promise.all([
      this.prisma.auditLog.count({ where }),
      this.prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take:  opts?.limit  ?? 50,
        skip:  opts?.offset ?? 0,
        include: { user: { select: { id: true, name: true, email: true } } },
      }),
    ]);

    return { total, items };
  }
}
