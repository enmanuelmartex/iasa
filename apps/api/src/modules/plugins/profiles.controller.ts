import {
  Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ProfilesService } from './profiles.service';

@UseGuards(JwtAuthGuard)
@Controller('plugins/profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  // GET /plugins/profiles
  @Get()
  findAll(@Request() req: any) {
    return this.profilesService.findAll(req.user.id);
  }

  // GET /plugins/profiles/:id
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.profilesService.findOne(id, req.user.id);
  }

  // POST /plugins/profiles
  @Post()
  create(
    @Body() body: {
      name: string;
      description?: string;
      icon?: string;
      enabledPlugins: string[];
      pluginConfigs?: Record<string, any>;
    },
    @Request() req: any,
  ) {
    return this.profilesService.create(req.user.id, body);
  }

  // PUT /plugins/profiles/:id
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: {
      name?: string;
      description?: string;
      icon?: string;
      enabledPlugins?: string[];
      pluginConfigs?: Record<string, any>;
    },
    @Request() req: any,
  ) {
    return this.profilesService.update(id, req.user.id, body);
  }

  // DELETE /plugins/profiles/:id
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.profilesService.remove(id, req.user.id);
  }
}
