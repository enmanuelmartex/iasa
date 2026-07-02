import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import type { AiCompletionRequest, AiCompletionResponse, AiProviderStatus, IAiProvider } from '../interfaces/ai-provider.interface';

/** Anthropic Claude — uses the official @anthropic-ai/sdk */
@Injectable()
export class ClaudeProvider implements IAiProvider {
  private readonly logger = new Logger(ClaudeProvider.name);
  readonly providerName = 'claude';
  readonly model: string;
  private client: Anthropic | null = null;
  private unavailableReason?: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('ai.claude.apiKey');
    this.model = this.configService.get<string>('ai.claude.model', 'claude-haiku-4-5-20251001');

    if (apiKey) {
      this.client = new Anthropic({ apiKey });
      this.logger.log(`Claude provider initialised (model: ${this.model})`);
    } else {
      this.unavailableReason = 'CLAUDE_API_KEY is not configured';
    }
  }

  isAvailable(): boolean {
    return this.client !== null;
  }

  getStatus(): AiProviderStatus {
    return {
      provider: 'claude',
      model: this.model,
      available: this.isAvailable(),
      reason: this.unavailableReason,
    };
  }

  async complete(request: AiCompletionRequest): Promise<AiCompletionResponse> {
    if (!this.client) throw new Error('Claude provider not configured');

    const systemPrompt = request.jsonMode
      ? `${request.systemPrompt ?? ''}\n\nYou MUST respond with valid JSON only. No markdown, no explanation — raw JSON.`.trim()
      : request.systemPrompt;

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: request.maxTokens ?? 2000,
      ...(systemPrompt ? { system: systemPrompt } : {}),
      messages: [{ role: 'user', content: request.userPrompt }],
      temperature: request.temperature,
    });

    const block = response.content[0];
    return {
      content: block.type === 'text' ? block.text : '',
      tokensUsed: (response.usage.input_tokens ?? 0) + (response.usage.output_tokens ?? 0),
    };
  }
}
