import {
  Controller,
  Get,
  Delete,
  Param,
  UseGuards,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ReportsService } from './reports.service';
import { ReportGeneratorService } from './report-generator.service';

type ReportFormat = 'JSON' | 'HTML' | 'MARKDOWN' | 'SARIF';
type ReportType = 'TECHNICAL' | 'EXECUTIVE' | 'DEVELOPER' | 'COMPLIANCE';

@ApiTags('Reports')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(
    private reportsService: ReportsService,
    private reportGenerator: ReportGeneratorService,
  ) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get reports statistics and security trend' })
  getStats(@CurrentUser() user: any) {
    return this.reportsService.getStats(user.id);
  }

  @Get()
  @ApiOperation({ summary: 'List all reports' })
  findAll(
    @CurrentUser() user: any,
    @Query('assessmentId') assessmentId?: string,
  ) {
    return this.reportsService.findAll(user.id, assessmentId);
  }

  @Get('assessment/:assessmentId/generate')
  @ApiOperation({ summary: 'Generate and download a report for an assessment' })
  async generate(
    @Param('assessmentId') assessmentId: string,
    @CurrentUser() user: any,
    @Query('format') format: ReportFormat = 'HTML',
    @Query('type') type: ReportType = 'TECHNICAL',
    @Res() res: Response,
  ) {
    const assessment = await this.reportGenerator.getAssessmentData(assessmentId, user.id);
    const projectName = ((assessment.project as any).name ?? 'report').replace(/[^a-z0-9]/gi, '-');
    const ts = new Date().toISOString().split('T')[0];

    let content: string;
    let contentType: string;
    let filename: string;

    switch (format) {
      case 'JSON':
        content = this.reportGenerator.generateJson(assessment);
        contentType = 'application/json';
        filename = `iasa-${projectName}-${ts}.json`;
        break;
      case 'MARKDOWN':
        content = this.reportGenerator.generateMarkdown(assessment);
        contentType = 'text/markdown';
        filename = `iasa-${projectName}-${ts}.md`;
        break;
      case 'SARIF':
        content = this.reportGenerator.generateSarif(assessment);
        contentType = 'application/sarif+json';
        filename = `iasa-${projectName}-${ts}.sarif`;
        break;
      case 'HTML':
      default:
        content = this.reportGenerator.generateHtml(assessment, type);
        contentType = 'text/html';
        filename = `iasa-${projectName}-${ts}.html`;
        break;
    }

    await this.reportsService.createRecord({
      assessmentId,
      type,
      format,
      title: `${type} — ${(assessment.project as any).name} — ${ts}`,
      fileSize: Buffer.byteLength(content, 'utf8'),
    });

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', Buffer.byteLength(content, 'utf8'));
    res.send(content);
  }

  @Get('assessment/:assessmentId')
  @ApiOperation({ summary: 'List reports by assessment' })
  findByAssessment(
    @Param('assessmentId') assessmentId: string,
    @CurrentUser() user: any,
  ) {
    return this.reportsService.findByAssessment(assessmentId, user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get report details' })
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.reportsService.findOne(id, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a report' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.reportsService.remove(id, user.id);
  }
}
