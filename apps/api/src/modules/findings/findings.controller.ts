import { Controller, Get, Param, Patch, Body, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { FindingsService } from './findings.service';

@ApiTags('Findings')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('findings')
export class FindingsController {
  constructor(private findingsService: FindingsService) {}

  @Get()
  @ApiOperation({ summary: 'List all findings with optional filters' })
  findAll(
    @CurrentUser() user: any,
    @Query('severity') severity?: string,
    @Query('status') status?: string,
    @Query('projectId') projectId?: string,
    @Query('assessmentId') assessmentId?: string,
    @Query('owaspCategory') owaspCategory?: string,
  ) {
    return this.findingsService.findAll(user.id, {
      severity, status, projectId, assessmentId, owaspCategory,
    });
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get findings statistics' })
  getStats(@CurrentUser() user: any) {
    return this.findingsService.getStats(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get finding details' })
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.findingsService.findOne(id, user.id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update finding status' })
  updateStatus(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body('status') status: string,
    @Body('notes') notes?: string,
  ) {
    return this.findingsService.updateStatus(id, user.id, status, notes);
  }
}
