import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import type { AiCompletionRequest, AiCompletionResponse, AiProviderStatus, IAiProvider } from '../interfaces/ai-provider.interface';

@Injectable()
export class OpenAiProvider implements IAiProvider {
  private readonly logger = new Logger(OpenAiProvider.name);
  readonly providerName = 'openai';
  readonly model: string;
  private client: OpenAI | null = null;
  private unavailableReason?: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('ai.openai.apiKey');
    this.model = this.configService.get<string>('ai.openai.model', 'gpt-4o-mini');

    if (apiKey) {
      this.client = new OpenAI({ apiKey });
      this.logger.log(`OpenAI provider initialised (model: ${this.model})`);
    } else {
      this.unavailableReason = 'OPENAI_API_KEY is not configured';
      this.logger.warn('OpenAI provider not configured — OPENAI_API_KEY missing');
    }
  }

  isAvailable(): boolean {
    return this.client !== null;
  }

  getStatus(): AiProviderStatus {
    return {
      provider: 'openai',
      model: this.model,
      available: this.isAvailable(),
      reason: this.unavailableReason,
    };
  }

  async complete(request: AiCompletionRequest): Promise<AiCompletionResponse> {
    if (!this.client) throw new Error('OpenAI provider not configured');

    const messages: OpenAI.ChatCompletionMessageParam[] = [];
    if (request.systemPrompt) {
      messages.push({ role: 'system', content: request.systemPrompt });
    }
    messages.push({ role: 'user', content: request.userPrompt });

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages,
      max_tokens: request.maxTokens,
      temperature: request.temperature,
      ...(request.jsonMode ? { response_format: { type: 'json_object' } } : {}),
    });

    return {
      content: response.choices[0]?.message?.content || '',
      tokensUsed: response.usage?.total_tokens,
    };
  }
}
