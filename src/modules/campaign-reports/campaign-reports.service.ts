import {
  Injectable,
  Inject,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import {
  EventApiService,
  GetCampaignReportRowsForSyncResult,
} from '@/modules/event-api/event-api.service';
import { CAMPAIGN_REPORTS_REPOSITORY } from './repository';
import type { ICampaignReportsRepository } from './repository';
import type { CampaignReportEntity } from './entities';
import { SyncReportsDto } from './dto';
import { StatsQueryDto } from './dto/stats-query.dto';
import { CampaignReportStatsDto } from './dto/campaign-report.dto';

@Injectable()
export class CampaignReportsService {
  private readonly logger = new Logger(CampaignReportsService.name);

  constructor(
    @Inject(CAMPAIGN_REPORTS_REPOSITORY)
    private readonly repository: ICampaignReportsRepository,
    private readonly eventApiService: EventApiService,
  ) {}

  async syncReports(
    dto: SyncReportsDto,
  ): Promise<{ synced: number; next?: string }> {
    let result: GetCampaignReportRowsForSyncResult;
    if (dto.next) {
      this.logger.debug(`syncReports: fetching next page`);
      result = await this.eventApiService.getCampaignReportRowsForSync({
        nextToken: dto.next,
      });
    } else {
      const { from_date, to_date, event_name, size } = dto;
      if (!from_date || !to_date || event_name === undefined) {
        throw new BadRequestException(
          'from_date, to_date and event_name are required when next is not provided',
        );
      }
      this.logger.debug(
        `syncReports: from_date=${from_date} to_date=${to_date} event_name=${event_name} size=${size ?? 100}`,
      );
      result = await this.eventApiService.getCampaignReportRowsForSync({
        from_date,
        to_date,
        event_name,
        take: size ?? 100,
      });
    }
    const { rows, nextToken } = result;
    this.logger.debug(`syncReports: got ${rows.length} rows`);
    await this.repository.upsert(rows as Partial<CampaignReportEntity>[]);
    return nextToken
      ? { synced: rows.length, next: nextToken }
      : { synced: rows.length };
  }

  async getStats(dto: StatsQueryDto): Promise<CampaignReportStatsDto[]> {
    this.logger.debug(
      `getStats: from_date=${dto.from_date} to_date=${dto.to_date} event_name=${dto.event_name ?? 'all'}`,
    );
    const fromDate = new Date(dto.from_date);
    const toDate = new Date(dto.to_date);
    toDate.setUTCHours(23, 59, 59, 999);
    const take = dto.take ?? 10;
    const skip = dto.skip ?? 0;
    return this.repository.getStats(
      fromDate,
      toDate,
      dto.event_name,
      take,
      skip,
    );
  }
}
