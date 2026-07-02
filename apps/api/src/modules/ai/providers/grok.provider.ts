import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import type { AiCompletionRequest, AiCompletionResponse, AiProviderStatus, IAiProvider } from '../interfaces/ai-provider.interface';

/** Groq Cloud — ultra-fast inference via OpenAI-compatible API at api.groq.com */
@Injectable()
export class GrokProvider implements IAiProvider {
  private readonly logger = new Logger(GrokProvider.name);
  readonly providerName = 'grok';
  readonly model: string;
  private client: OpenAI | null = null;
  private unavailableReason?: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('ai.grok.apiKey');
    this.model = this.configService.get<string>('ai.grok.model', 'llama-3.3-70b-versatile');

    if (apiKey) {
      this.client = new OpenAI({ apiKey, baseURL: 'https://api.groq.com/openai/v1' });
      this.logger.log(`Groq provider initialised (model: ${this.model})`);
    } else {
      this.unavailableReason = 'GROQ_API_KEY is not configured';
    }
  }

  isAvailable(): boolean {
    return this.client !== null;
  }

  getStatus(): AiProviderStatus {
    return {
      provider: 'grok',
      model: this.model,
      available: this.isAvailable(),
      reason: this.unavailableReason,
    };
  }

  async complete(request: AiCompletionRequest): Promise<AiCompletionResponse> {
    if (!this.client) throw new Error('Groq provider not configured');

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
