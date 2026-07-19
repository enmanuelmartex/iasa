import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class RunAssessmentDto {
  @ApiPropertyOptional({ enum: ['all', 'profile', 'manual'], default: 'all' })
  @IsOptional()
  @IsIn(['all', 'profile', 'manual'])
  executionMode?: 'all' | 'profile' | 'manual';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  scanProfileId?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  manualPlugins?: string[];

  @IsOptional()
  @IsBoolean()
  enableAiAnalysis?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  maxRequestsPerEndpoint?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(60_000)
  requestDelayMs?: number;

  @IsOptional()
  @IsInt()
  @Min(1_000)
  @Max(120_000)
  timeoutMs?: number;
}
