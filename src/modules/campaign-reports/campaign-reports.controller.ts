import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CampaignReportsService } from './campaign-reports.service';
import { SyncReportsDto } from './dto';
import { StatsQueryDto } from './dto/stats-query.dto';
import {
  SyncReportsResponseDto,
  CampaignReportStatsDto,
} from './dto/campaign-report.dto';

@ApiTags('Campaign Reports')
@Controller('reports')
export class CampaignReportsController {
  constructor(
    private readonly campaignReportsService: CampaignReportsService,
  ) {}

  @Post('sync')
  @ApiOperation({ summary: 'Sync campaign report data' })
  @ApiResponse({
    status: 200,
    description: 'Sync result',
    type: SyncReportsResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async sync(@Body() dto: SyncReportsDto) {
    return this.campaignReportsService.syncReports(dto);
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Get aggregated stats by ad_id and date',
    description: 'Supports pagination via query params: take (1–100, default 10), skip (default 0).',
  })
  @ApiResponse({
    status: 200,
    description: 'Stats list',
    type: [CampaignReportStatsDto],
  })
  async stats(@Query() dto: StatsQueryDto) {
    return this.campaignReportsService.getStats(dto);
  }
}
