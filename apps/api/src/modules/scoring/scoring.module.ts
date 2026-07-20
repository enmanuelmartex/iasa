import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ScoringService } from './scoring.service';
import { ComparisonService } from './comparison.service';
import { ScoringController } from './scoring.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ScoringController],
  providers: [ScoringService, ComparisonService],
  exports: [ScoringService, ComparisonService],
})
export class ScoringModule {}
