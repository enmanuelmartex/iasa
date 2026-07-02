import {
  Controller, Get, Put, Post, Param, Body, UseGuards, Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PluginsService } from './plugins.service';
import { PluginExecutorService } from './plugin-executor.service';
import { PluginRegistryService } from './plugin-registry.service';
import { PluginCategory } from '../scanner/types/plugin-manifest.types';

@UseGuards(JwtAuthGuard)
@Controller('plugins')
export class PluginsController {
  constructor(
    private readonly pluginsService: PluginsService,
    private readonly executor: PluginExecutorService,
    private readonly registry: PluginRegistryService,
  ) {}

  // GET /plugins — list all with user state
  @Get()
  findAll(@Request() req: any) {
    return this.pluginsService.findAll(req.user.id);
  }

  // GET /plugins/categories — distinct categories in use
  @Get('categories')
  getCategories() {
    return Object.values(PluginCategory);
  }

  // GET /plugins/:id — plugin detail with stats
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.pluginsService.findOne(id, req.user.id);
  }

  // PUT /plugins/:id/toggle — enable / disable for user
  @Put(':id/toggle')
  toggle(
    @Param('id') id: string,
    @Body() body: { isEnabled: boolean },
    @Request() req: any,
  ) {
    return this.pluginsService.toggle(id, req.user.id, body.isEnabled);
  }

  // PUT /plugins/:id/config — save user-specific config
  @Put(':id/config')
  saveConfig(
    @Param('id') id: string,
    @Body() body: Record<string, any>,
    @Request() req: any,
  ) {
    return this.pluginsService.saveConfig(id, req.user.id, body);
  }

  // GET /plugins/:id/executions — execution history
  @Get(':id/executions')
  getExecutions(@Param('id') id: string, @Request() req: any) {
    return this.pluginsService.getExecutionHistory(id, req.user.id);
  }

  // GET /plugins/:id/findings — historical findings from this plugin
  @Get(':id/findings')
  getFindings(@Param('id') id: string, @Request() req: any) {
    return this.pluginsService.getFindings(id, req.user.id);
  }

  // POST /plugins/:id/run — run single plugin against a project
  @Post(':id/run')
  runPlugin(
    @Param('id') pluginId: string,
    @Body() body: { projectId: string; pluginConfig?: Record<string, any>; timeoutMs?: number },
    @Request() req: any,
  ) {
    return this.executor.runSinglePlugin({
      pluginId,
      projectId: body.projectId,
      userId: req.user.id,
      pluginConfig: body.pluginConfig,
      timeoutMs: body.timeoutMs,
    });
  }

}
