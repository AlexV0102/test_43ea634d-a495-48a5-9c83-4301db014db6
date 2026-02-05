import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SyncReportsResponseDto {
  @ApiProperty({ example: 42, description: 'Number of rows synced' })
  synced: number;

  @ApiPropertyOptional({ description: 'Token to request next page' })
  next?: string;
}

export class CampaignReportStatsDto {
  @ApiProperty({ example: 'ad-123' })
  ad_id: string;

  @ApiProperty({ example: '2025-01-15', description: 'Date (YYYY-MM-DD)' })
  date: string;

  @ApiProperty({ example: 5 })
  count: number;
}

export class CampaignReportResponseDto {
  id: string;
  campaign: string;
  campaign_id: string;
  adgroup: string;
  adgroup_id: string;
  ad: string;
  ad_id: string;
  client_id: string;
  event_name: string;
  event_time: Date;
}
