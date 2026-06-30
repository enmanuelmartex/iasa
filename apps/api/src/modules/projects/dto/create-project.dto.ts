import { IsString, IsUrl, IsOptional, IsEnum, MaxLength, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ProjectEnvironment {
  DEVELOPMENT = 'DEVELOPMENT',
  STAGING = 'STAGING',
  PRODUCTION = 'PRODUCTION',
}

export class CreateProjectDto {
  @ApiProperty({ example: 'My REST API' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ example: 'Main backend API for mobile app' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ example: 'https://api.example.com' })
  @IsString()
  baseUrl: string;

  @ApiPropertyOptional({ enum: ProjectEnvironment, default: 'DEVELOPMENT' })
  @IsOptional()
  @IsEnum(ProjectEnvironment)
  environment?: ProjectEnvironment;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsString()
  baseUrl?: string;

  @IsOptional()
  @IsEnum(ProjectEnvironment)
  environment?: ProjectEnvironment;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
