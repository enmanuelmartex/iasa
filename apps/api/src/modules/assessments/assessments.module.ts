import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AssessmentsController } from './assessments.controller';
import { AssessmentsService } from './assessments.service';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'scanner' }),
  ],
  controllers: [AssessmentsController],
  providers: [AssessmentsService],
  exports: [AssessmentsService],
})
export class AssessmentsModule {}
