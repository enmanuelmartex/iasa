import {
  Controller, Get, Put, Delete, Post, Body, Param, UseGuards, HttpCode,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { AiService } from './ai.service';
import { AiConfigService, SaveProviderConfigDto, TestConnectionDto } from './ai-config.service';

/**
 * `AiProviderConfig` is GLOBAL platform state — it has no `userId`. Every
 * mutation here changes the provider, model and API key for every user, so the
 * whole `/config` surface is ADMIN-only.
 *
 * `GET /ai/status` stays available to any authenticated user: the scan UI needs
 * to know whether AI enrichment is available, and it exposes no credentials.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ai')
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly aiConfigService: AiConfigService,
  ) {}

  // ── Provider Status ───────────────────────────────────────────────────────

  @Get('status')
  async getStatus() {
    return this.aiService.getProviderStatus();
  }

  // ── Static routes FIRST (must precede :provider param routes) ────────────

  /** Returns all 5 providers with their current config + status. */
  @Roles('ADMIN')
  @Get('config')
  async getAllConfigs() {
    return this.aiConfigService.getAllConfigs();
  }

  /** Returns which env vars are configured — for the admin env status panel. */
  @Roles('ADMIN')
  @Get('config/env-status')
  getEnvStatus() {
    return this.aiConfigService.getEnvStatus();
  }

  /** Deactivates all providers — disables AI analysis. */
  @Roles('ADMIN')
  @Put('config/deactivate-all')
  @HttpCode(204)
  async deactivateAll() {
    await this.aiConfigService.deactivateAll();
  }

  // ── Per-Provider routes (:provider param) — declared AFTER static routes ─

  /** Returns a single provider's config. */
  @Roles('ADMIN')
  @Get('config/:provider')
  async getProviderConfig(@Param('provider') provider: string) {
    return this.aiConfigService.getProviderConfig(provider);
  }

  /** Saves config for one provider (model, key, analysis settings). */
  @Roles('ADMIN')
  @Put('config/:provider')
  async saveProviderConfig(
    @Param('provider') provider: string,
    @Body() dto: SaveProviderConfigDto,
  ) {
    return this.aiConfigService.saveProviderConfig(provider, dto);
  }

  /** Sets the given provider as the active AI provider. */
  @Roles('ADMIN')
  @Put('config/:provider/activate')
  async activateProvider(@Param('provider') provider: string) {
    return this.aiConfigService.activateProvider(provider);
  }

  /** Tests a provider connection. Result is persisted in DB. */
  @Roles('ADMIN')
  @Post('config/:provider/test')
  async testProvider(
    @Param('provider') provider: string,
    @Body() dto: TestConnectionDto,
  ) {
    return this.aiConfigService.testProvider(provider, dto);
  }

  /** Removes DB config for one provider (reverts to env vars for that provider). */
  @Roles('ADMIN')
  @Delete('config/:provider')
  @HttpCode(204)
  async deleteProviderConfig(@Param('provider') provider: string) {
    await this.aiConfigService.deleteProviderConfig(provider);
  }
}
