import { CampaignReportEntity } from '@/modules/campaign-reports/entities';
import type { CampaignReportResponseDto } from '@/modules/campaign-reports/dto/campaign-report.dto';

export class CampaignReportMapper {
  static toDto(entity: CampaignReportEntity): CampaignReportResponseDto {
    return {
      id: entity.id,
      campaign: entity.campaign,
      campaign_id: entity.campaign_id,
      adgroup: entity.adgroup,
      adgroup_id: entity.adgroup_id,
      ad: entity.ad,
      ad_id: entity.ad_id,
      client_id: entity.client_id,
      event_name: entity.event_name,
      event_time: entity.event_time,
    };
  }
}
