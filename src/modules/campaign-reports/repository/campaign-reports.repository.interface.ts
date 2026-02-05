import { CampaignReportEntity } from '@/modules/campaign-reports/entities';
import type { CampaignReportStatsDto } from '@/modules/campaign-reports/dto/campaign-report.dto';

export const CAMPAIGN_REPORTS_REPOSITORY = Symbol(
  'CAMPAIGN_REPORTS_REPOSITORY',
);

export interface ICampaignReportsRepository {
  upsert(entities: Partial<CampaignReportEntity>[]): Promise<void>;
  getStats(
    fromDate: Date,
    toDate: Date,
    eventName: string | undefined,
    take: number,
    skip: number,
  ): Promise<CampaignReportStatsDto[]>;
}
