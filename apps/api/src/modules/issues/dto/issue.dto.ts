import { IsEnum, IsInt, IsISO8601, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Mirrors the Prisma IssueStatus enum. Declared here rather than imported so the
 * HTTP contract is validated by class-validator and an unknown value produces a
 * 400 instead of reaching the database and surfacing as a 500 — the failure mode
 * the old `status as any` cast had.
 */
export enum IssueStatusDto {
  OPEN = 'OPEN',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  RESOLVED = 'RESOLVED',
  ACCEPTED_RISK = 'ACCEPTED_RISK',
  FALSE_POSITIVE = 'FALSE_POSITIVE',
}

export enum SeverityDto {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  INFO = 'INFO',
}

export class IssueQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() projectId?: string;
  @ApiPropertyOptional({ enum: IssueStatusDto }) @IsOptional() @IsEnum(IssueStatusDto) status?: string;
  @ApiPropertyOptional({ enum: SeverityDto }) @IsOptional() @IsEnum(SeverityDto) severity?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() owaspCategory?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() pluginId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ruleId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assigneeId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(200) search?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  page?: number;

  @ApiPropertyOptional({ default: 20, maximum: 100 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100)
  pageSize?: number;
}

export class UpdateIssueStatusDto {
  @IsEnum(IssueStatusDto)
  status: string;

  /** Required by the service for RESOLVED, FALSE_POSITIVE and ACCEPTED_RISK. */
  @IsOptional() @IsString() @MaxLength(2000)
  reason?: string;

  /** Only meaningful for ACCEPTED_RISK; the acceptance lapses on this date. */
  @IsOptional() @IsISO8601()
  acceptedRiskUntil?: string;
}

export class AssignIssueDto {
  @IsOptional() @IsString()
  assigneeId?: string | null;
}
