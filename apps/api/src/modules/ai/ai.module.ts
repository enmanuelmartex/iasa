import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { OpenAiProvider } from './providers/openai.provider';
import { GrokProvider } from './providers/grok.provider';
import { ClaudeProvider } from './providers/claude.provider';
import { GeminiProvider } from './providers/gemini.provider';
import { OllamaProvider } from './providers/ollama.provider';
import { NoopAiProvider } from './providers/noop.provider';
import { AiProviderFactory } from './ai-provider.factory';
import { AiConfigService } from './ai-config.service';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';

@Module({
  imports: [PrismaModule],
  providers: [
    // Concrete providers — used as env-var fallback
    OpenAiProvider,
    GrokProvider,
    ClaudeProvider,
    GeminiProvider,
    OllamaProvider,
    NoopAiProvider,
    // Config resolution (DB → env → defaults) + encryption
    AiConfigService,
    // Factory resolves the active provider at call-time (supports DB override)
    AiProviderFactory,
    // Public service consumed by the scanner
    AiService,
  ],
  controllers: [AiController],
  exports: [AiService, AiConfigService],
})
export class AiModule {}
