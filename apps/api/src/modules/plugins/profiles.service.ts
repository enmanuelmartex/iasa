import { Injectable, NotFoundException, ForbiddenException, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

interface CreateProfileDto {
  name: string;
  description?: string;
  icon?: string;
  enabledPlugins: string[];
  pluginConfigs?: Record<string, any>;
}

const SYSTEM_PROFILES = [
  {
    id: 'full-scan',
    name: 'Full Scan',
    description: 'Runs all available security plugins. Recommended for complete audits.',
    icon: 'shield',
    enabledPlugins: [
      'security-headers', 'cors', 'broken-authentication', 'jwt-analysis',
      'bola', 'bfla', 'mass-assignment', 'rate-limit', 'sensitive-data', 'ssrf',
    ],
  },
  {
    id: 'quick-scan',
    name: 'Quick Scan',
    description: 'Fast scan covering the most critical categories. Ideal for CI pipelines.',
    icon: 'zap',
    enabledPlugins: ['security-headers', 'cors', 'broken-authentication', 'sensitive-data'],
  },
  {
    id: 'auth-audit',
    name: 'Authentication Audit',
    description: 'Deep dive into authentication and authorization controls.',
    icon: 'lock',
    enabledPlugins: ['broken-authentication', 'jwt-analysis', 'bola', 'bfla'],
  },
  {
    id: 'headers-audit',
    name: 'Headers Audit',
    description: 'Focuses on HTTP security headers and CORS configuration.',
    icon: 'layers',
    enabledPlugins: ['security-headers', 'cors'],
  },
  {
    id: 'owasp-api-top10',
    name: 'OWASP API Top 10',
    description: 'Covers all OWASP API Security Top 10 categories (2023).',
    icon: 'list',
    enabledPlugins: [
      'bola', 'broken-authentication', 'mass-assignment', 'rate-limit',
      'bfla', 'sensitive-data', 'ssrf', 'security-headers', 'cors', 'jwt-analysis',
    ],
  },
  {
    id: 'compliance',
    name: 'Compliance Scan',
    description: 'Targets PII/sensitive data exposure and security header requirements.',
    icon: 'check-circle',
    enabledPlugins: ['sensitive-data', 'security-headers', 'cors'],
  },
];

@Injectable()
export class ProfilesService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedSystemProfiles();
  }

  private async seedSystemProfiles() {
    for (const profile of SYSTEM_PROFILES) {
      await this.prisma.scanProfile.upsert({
        where: { id: profile.id },
        create: { ...profile, isSystem: true },
        update: { name: profile.name, description: profile.description, enabledPlugins: profile.enabledPlugins },
      });
    }
  }

  // ── List all profiles (system + user's own) ───────────────────────────────

  async findAll(userId: string) {
    return this.prisma.scanProfile.findMany({
      where: { OR: [{ isSystem: true }, { userId }] },
      orderBy: [{ isSystem: 'desc' }, { createdAt: 'asc' }],
    });
  }

  // ── Get single profile ────────────────────────────────────────────────────

  async findOne(profileId: string, userId: string) {
    const profile = await this.prisma.scanProfile.findUnique({ where: { id: profileId } });
    if (!profile) throw new NotFoundException('Scan profile not found');
    if (!profile.isSystem && profile.userId !== userId) throw new ForbiddenException();
    return profile;
  }

  // ── Create custom profile ─────────────────────────────────────────────────

  async create(userId: string, dto: CreateProfileDto) {
    return this.prisma.scanProfile.create({
      data: { ...dto, userId, isSystem: false },
    });
  }

  // ── Update custom profile ─────────────────────────────────────────────────

  async update(profileId: string, userId: string, dto: Partial<CreateProfileDto>) {
    const profile = await this.prisma.scanProfile.findUnique({ where: { id: profileId } });
    if (!profile) throw new NotFoundException('Scan profile not found');
    if (profile.isSystem) throw new ForbiddenException('Cannot modify system profiles');
    if (profile.userId !== userId) throw new ForbiddenException();

    return this.prisma.scanProfile.update({ where: { id: profileId }, data: dto });
  }

  // ── Delete custom profile ─────────────────────────────────────────────────

  async remove(profileId: string, userId: string) {
    const profile = await this.prisma.scanProfile.findUnique({ where: { id: profileId } });
    if (!profile) throw new NotFoundException('Scan profile not found');
    if (profile.isSystem) throw new ForbiddenException('Cannot delete system profiles');
    if (profile.userId !== userId) throw new ForbiddenException();

    await this.prisma.scanProfile.delete({ where: { id: profileId } });
    return { deleted: true };
  }
}
