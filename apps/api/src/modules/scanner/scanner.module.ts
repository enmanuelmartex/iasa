import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ScannerService } from './scanner.service';
import { ScannerProcessor } from './scanner.processor';
import { AiAnalysisService } from './plugins/ai-analysis/ai-analysis.service';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'scanner' }),
  ],
  providers: [ScannerService, ScannerProcessor, AiAnalysisService],
  exports: [ScannerService],
})
export class ScannerModule {}
