import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { IssueLifecycleService } from './issue-lifecycle.service';

@Module({
  imports: [PrismaModule],
  providers: [IssueLifecycleService],
  exports: [IssueLifecycleService],
})
export class IssuesModule {}
