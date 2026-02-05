import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsIn, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { EVENT_NAMES } from '@/shared/constants';
import type { EventName } from '@/shared/types';

export class StatsQueryDto {
  @ApiProperty({ example: '2025-01-01', description: 'Start date (ISO)' })
  @IsDateString()
  from_date: string;

  @ApiProperty({ example: '2025-01-31', description: 'End date (ISO)' })
  @IsDateString()
  to_date: string;

  @ApiPropertyOptional({ enum: [...EVENT_NAMES], description: 'Filter by event type' })
  @IsOptional()
  @IsIn(EVENT_NAMES as readonly string[])
  event_name?: EventName;

  @ApiPropertyOptional({ example: 10, minimum: 1, maximum: 100, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  take: number = 10;

  @ApiPropertyOptional({ example: 0, minimum: 0, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  skip: number = 0;
}
