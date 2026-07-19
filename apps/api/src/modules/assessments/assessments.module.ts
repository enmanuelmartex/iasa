import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AssessmentsController } from './assessments.controller';
import { AssessmentsService } from './assessments.service';
import { PluginsModule } from '../plugins/plugins.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'scanner' }),
    PluginsModule,
  ],
  controllers: [AssessmentsController],
  providers: [AssessmentsService],
  exports: [AssessmentsService],
})
export class AssessmentsModule {}
