export interface CampaignReportRow {
  campaign: string;
  campaign_id: string;
  adgroup: string;
  adgroup_id: string;
  ad: string;
  ad_id: string;
  client_id: string;
  event_name: string;
  event_time: Date | undefined;
}

export function parseCsvRowToCampaignReportRow(
  row: Record<string, string>,
): CampaignReportRow {
  return {
    campaign: row.campaign ?? '',
    campaign_id: row.campaign_id ?? '',
    adgroup: row.adgroup ?? '',
    adgroup_id: row.adgroup_id ?? '',
    ad: row.ad ?? '',
    ad_id: row.ad_id ?? '',
    client_id: row.client_id ?? '',
    event_name: row.event_name ?? '',
    event_time: row.event_time ? new Date(row.event_time) : undefined,
  };
}
