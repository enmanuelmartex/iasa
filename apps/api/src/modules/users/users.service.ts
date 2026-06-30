import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true, email: true, name: true, role: true,
        isActive: true, lastLogin: true, createdAt: true,
        _count: { select: { projects: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true, email: true, name: true, role: true,
        isActive: true, lastLogin: true, createdAt: true, updatedAt: true,
        _count: { select: { projects: true } },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
