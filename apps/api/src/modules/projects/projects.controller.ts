import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/create-project.dto';

@ApiTags('Projects')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: 'List all projects' })
  findAll(@CurrentUser() user: any) {
    return this.projectsService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project details' })
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.projectsService.findOne(id, user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  create(@CurrentUser() user: any, @Body() dto: CreateProjectDto) {
    return this.projectsService.create(user.id, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a project' })
  update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, user.id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a project' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.projectsService.remove(id, user.id);
  }

  @Post(':id/spec/url')
  @ApiOperation({ summary: 'Import OpenAPI spec from URL' })
  importFromUrl(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body('url') url: string,
  ) {
    return this.projectsService.importOpenApiFromUrl(id, user.id, url);
  }

  @Post(':id/spec/upload')
  @ApiOperation({ summary: 'Import OpenAPI spec from uploaded content' })
  importFromUpload(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body('spec') spec: object,
  ) {
    return this.projectsService.importOpenApiFromContent(id, user.id, spec);
  }

  @Post(':id/auth')
  @ApiOperation({ summary: 'Save authentication configuration' })
  saveAuth(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() authData: any,
  ) {
    return this.projectsService.saveAuthConfig(id, user.id, authData);
  }
}
