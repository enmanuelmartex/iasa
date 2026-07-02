import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import type { AiCompletionRequest, AiCompletionResponse, AiProviderStatus, IAiProvider } from '../interfaces/ai-provider.interface';

/** Google Gemini — uses the official @google/genai SDK */
@Injectable()
export class GeminiProvider implements IAiProvider {
  private readonly logger = new Logger(GeminiProvider.name);
  readonly providerName = 'gemini';
  readonly model: string;
  private client: GoogleGenAI | null = null;
  private unavailableReason?: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('ai.gemini.apiKey');
    this.model = this.configService.get<string>('ai.gemini.model', 'gemini-2.5-flash');

    if (apiKey) {
      this.client = new GoogleGenAI({ apiKey });
      this.logger.log(`Gemini provider initialised (model: ${this.model})`);
    } else {
      this.unavailableReason = 'GEMINI_API_KEY is not configured';
    }
  }

  isAvailable(): boolean {
    return this.client !== null;
  }

  getStatus(): AiProviderStatus {
    return {
      provider: 'gemini',
      model: this.model,
      available: this.isAvailable(),
      reason: this.unavailableReason,
    };
  }

  async complete(request: AiCompletionRequest): Promise<AiCompletionResponse> {
    if (!this.client) throw new Error('Gemini provider not configured');

    const result = await this.client.models.generateContent({
      model: this.model,
      contents: request.userPrompt,
      config: {
        ...(request.systemPrompt ? { systemInstruction: request.systemPrompt } : {}),
        maxOutputTokens: request.maxTokens ?? 2000,
        temperature: request.temperature,
        ...(request.jsonMode ? { responseMimeType: 'application/json' } : {}),
      },
    });

    return {
      content: result.text ?? '',
      tokensUsed: result.usageMetadata?.totalTokenCount,
    };
  }
}
