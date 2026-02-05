import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '@/core/base';
import { CampaignReportEntity } from '@/modules/campaign-reports/entities';
import type { ICampaignReportsRepository } from './campaign-reports.repository.interface';
import type { CampaignReportStatsDto } from '@/modules/campaign-reports/dto/campaign-report.dto';

@Injectable()
export class CampaignReportsRepository
  extends BaseRepository<CampaignReportEntity>
  implements ICampaignReportsRepository
{
  constructor(
    @InjectRepository(CampaignReportEntity)
    repository: Repository<CampaignReportEntity>,
  ) {
    super(repository);
  }

  async upsert(entities: Partial<CampaignReportEntity>[]): Promise<void> {
    if (entities.length === 0) return;
    const valid = entities.filter(
      (e) =>
        e.event_time != null &&
        e.client_id != null &&
        e.event_name != null &&
        e.campaign != null &&
        e.campaign_id != null &&
        e.adgroup != null &&
        e.adgroup_id != null &&
        e.ad != null &&
        e.ad_id != null,
    );
    if (valid.length === 0) return;
    await this.repository.upsert(valid, [
      'event_time',
      'client_id',
      'event_name',
    ]);
  }

  async getStats(
    fromDate: Date,
    toDate: Date,
    eventName: string | undefined,
    take: number,
    skip: number,
  ): Promise<CampaignReportStatsDto[]> {
    const qb = this.repository
      .createQueryBuilder('r')
      .select('r.ad_id', 'ad_id')
      .addSelect('DATE(r.event_time)', 'date')
      .addSelect('COUNT(*)', 'count')
      .where('r.event_time >= :fromDate', { fromDate })
      .andWhere('r.event_time <= :toDate', { toDate })
      .groupBy('r.ad_id')
      .addGroupBy('DATE(r.event_time)');

    if (eventName != null && eventName !== '') {
      qb.andWhere('r.event_name = :eventName', { eventName });
    }

    const rows = await qb
      .orderBy('r.ad_id')
      .addOrderBy('date')
      .limit(take)
      .offset(skip)
      .getRawMany<{ ad_id: string; date: Date | string; count: string }>();

    return rows.map((row) => ({
      ad_id: row.ad_id,
      date:
        typeof row.date === 'string'
          ? row.date
          : row.date instanceof Date
            ? row.date.toISOString().slice(0, 10)
            : String(row.date),
      count: Number(row.count),
    }));
  }
}
