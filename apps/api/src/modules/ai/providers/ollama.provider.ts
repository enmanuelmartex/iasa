import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AiCompletionRequest, AiCompletionResponse, AiProviderStatus, IAiProvider } from '../interfaces/ai-provider.interface';

/** Ollama — local model server via HTTP API. */
@Injectable()
export class OllamaProvider implements IAiProvider {
  private readonly logger = new Logger(OllamaProvider.name);
  readonly providerName = 'ollama';
  readonly model: string;
  private readonly baseUrl: string;
  private readonly timeoutMs: number;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('ai.ollama.baseUrl', 'http://localhost:11434');
    this.model = this.configService.get<string>('ai.ollama.model', 'llama3');
    this.timeoutMs = this.configService.get<number>('ai.ollama.timeoutMs', 60000);
    this.logger.log(`Ollama provider initialised (baseUrl: ${this.baseUrl}, model: ${this.model})`);
  }

  isAvailable(): boolean {
    return Boolean(this.baseUrl);
  }

  getStatus(): AiProviderStatus {
    return {
      provider: 'ollama',
      model: this.model,
      available: this.isAvailable(),
      reason: this.isAvailable() ? undefined : 'OLLAMA_BASE_URL not configured',
    };
  }

  async complete(request: AiCompletionRequest): Promise<AiCompletionResponse> {
    const prompt = request.systemPrompt
      ? `${request.systemPrompt}\n\n${request.userPrompt}`
      : request.userPrompt;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          prompt,
          stream: false,
          options: {
            temperature: request.temperature,
            num_predict: request.maxTokens,
          },
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Ollama API error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json() as any;
      return { content: data.response || '' };
    } finally {
      clearTimeout(timer);
    }
  }
}
