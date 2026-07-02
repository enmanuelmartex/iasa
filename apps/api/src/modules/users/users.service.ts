import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const SELECT_PUBLIC = {
  id: true,
  email: true,
  name: true,
  role: true,
  isActive: true,
  lastLogin: true,
  createdAt: true,
  updatedAt: true,
  _count: { select: { projects: true } },
} as const;

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
    private config: ConfigService,
  ) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: SELECT_PUBLIC,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: SELECT_PUBLIC,
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(dto: CreateUserDto, actorId: string) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    const rounds = this.config.get<number>('security.bcryptRounds', 12);
    const passwordHash = await bcrypt.hash(dto.password, rounds);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: passwordHash,
        role: dto.role ?? Role.ANALYST,
      },
      select: SELECT_PUBLIC,
    });

    this.audit.log({
      userId: actorId,
      action: 'CREATE',
      resource: 'user',
      resourceId: user.id,
      metadata: { email: user.email, role: user.role },
    });

    return user;
  }

  async update(id: string, dto: UpdateUserDto, actorId: string) {
    await this.findOne(id);
    const user = await this.prisma.user.update({
      where: { id },
      data: { name: dto.name },
      select: SELECT_PUBLIC,
    });

    this.audit.log({
      userId: actorId,
      action: 'UPDATE',
      resource: 'user',
      resourceId: id,
      metadata: { fields: Object.keys(dto) },
    });

    return user;
  }

  async changeRole(id: string, role: Role, actorId: string) {
    const current = await this.findOne(id);
    if (current.id === actorId) {
      throw new BadRequestException('Cannot change your own role');
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: { role },
      select: SELECT_PUBLIC,
    });

    this.audit.log({
      userId: actorId,
      action: 'ROLE_CHANGE' as any,
      resource: 'user',
      resourceId: id,
      metadata: { from: current.role, to: role },
    });

    return user;
  }

  async setActive(id: string, isActive: boolean, actorId: string) {
    const current = await this.findOne(id);
    if (current.id === actorId) {
      throw new BadRequestException('Cannot disable your own account');
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: { isActive },
      select: SELECT_PUBLIC,
    });

    this.audit.log({
      userId: actorId,
      action: 'UPDATE',
      resource: 'user',
      resourceId: id,
      metadata: { field: 'isActive', value: isActive },
    });

    return user;
  }

  async resetPassword(id: string, newPassword: string, actorId: string) {
    await this.findOne(id);
    const rounds = this.config.get<number>('security.bcryptRounds', 12);
    const passwordHash = await bcrypt.hash(newPassword, rounds);

    await this.prisma.user.update({
      where: { id },
      data: { password: passwordHash },
    });

    this.audit.log({
      userId: actorId,
      action: 'PASSWORD_RESET' as any,
      resource: 'user',
      resourceId: id,
    });

    return { success: true };
  }

  async remove(id: string, actorId: string) {
    if (id === actorId) {
      throw new BadRequestException('Cannot delete your own account');
    }
    const user = await this.findOne(id);
    await this.prisma.user.delete({ where: { id } });

    this.audit.log({
      userId: actorId,
      action: 'DELETE',
      resource: 'user',
      resourceId: id,
      metadata: { email: user.email },
    });

    return { success: true };
  }
}
