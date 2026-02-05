import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsIn, IsOptional, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { EVENT_NAMES } from '@/shared/constants';
import type { EventName } from '@/shared/types';

export class SyncReportsDto {
  @ApiPropertyOptional({ example: '2025-01-01', description: 'Start date (ISO)' })
  @IsOptional()
  @IsDateString()
  from_date?: string;

  @ApiPropertyOptional({ example: '2025-01-31', description: 'End date (ISO)' })
  @IsOptional()
  @IsDateString()
  to_date?: string;

  @ApiPropertyOptional({ enum: [...EVENT_NAMES], description: 'Event type' })
  @IsOptional()
  @IsIn(EVENT_NAMES as readonly string[])
  event_name?: EventName;

  @ApiPropertyOptional({ example: 100, minimum: 1, default: 100 })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  size?: number = 100;

  @ApiPropertyOptional({ description: 'Opaque token for next page (from previous response)' })
  @IsOptional()
  @IsString()
  next?: string;
}
