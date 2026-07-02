import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ScannerService } from './scanner.service';
import { ScannerProcessor } from './scanner.processor';
import { AiModule } from '../ai/ai.module';
import { PluginsModule } from '../plugins/plugins.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'scanner' }),
    AiModule,
    PluginsModule,
  ],
  providers: [ScannerService, ScannerProcessor],
  exports: [ScannerService],
})
export class ScannerModule {}
