import { Injectable } from '@nestjs/common';
import type { AiCompletionRequest, AiCompletionResponse, AiProviderStatus, IAiProvider } from '../interfaces/ai-provider.interface';

/** Returned when AI_PROVIDER=none or no API key is configured for the active provider. */
@Injectable()
export class NoopAiProvider implements IAiProvider {
  readonly providerName = 'none';
  readonly model = 'none';

  isAvailable(): boolean {
    return false;
  }

  getStatus(): AiProviderStatus {
    return {
      provider: 'none',
      model: 'none',
      available: false,
      reason: 'AI analysis disabled (AI_PROVIDER=none or no API key configured)',
    };
  }

  async complete(_request: AiCompletionRequest): Promise<AiCompletionResponse> {
    throw new Error('AI provider not configured');
  }
}
