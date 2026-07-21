import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { IssuesService } from './issues.service';
import { AssignIssueDto, IssueQueryDto, UpdateIssueStatusDto } from './dto/issue.dto';

/**
 * Persistent vulnerabilities.
 *
 * Replaces `/findings`, which returned one row per detection and therefore
 * showed the same vulnerability once per scan. Scan-specific detections are
 * available under `/issues/occurrences/assessment/:id`, kept explicitly separate
 * so the two are never conflated.
 */
@ApiTags('Issues')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('issues')
export class IssuesController {
  constructor(private readonly issues: IssuesService) {}

  @Get()
  @ApiOperation({ summary: 'List persistent issues (deduplicated, paginated)' })
  findAll(@CurrentUser() user: any, @Query() query: IssueQueryDto) {
    return this.issues.findAll(user.id, query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Aggregate counts over current issues' })
  getStats(@CurrentUser() user: any, @Query('projectId') projectId?: string) {
    return this.issues.getStats(user.id, projectId);
  }

  @Get('occurrences/assessment/:assessmentId')
  @ApiOperation({ summary: 'Detections produced by one scan' })
  findOccurrences(@Param('assessmentId') assessmentId: string, @CurrentUser() user: any) {
    return this.issues.findOccurrencesByAssessment(assessmentId, user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Issue detail with occurrence history and triage timeline' })
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.issues.findOne(id, user.id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Apply a triage decision' })
  updateStatus(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: UpdateIssueStatusDto,
  ) {
    return this.issues.updateStatus(id, user.id, dto);
  }

  @Patch(':id/assignee')
  @ApiOperation({ summary: 'Assign or unassign an issue' })
  assign(@Param('id') id: string, @CurrentUser() user: any, @Body() dto: AssignIssueDto) {
    return this.issues.assign(id, user.id, dto.assigneeId ?? null);
  }
}
