export interface ProbationTestDataPayload {
  csv: string;
  pagination?: {
    next?: string;
  };
}

export interface ProbationTestDataResponse {
  timestamp: number;
  data: ProbationTestDataPayload;
}

export interface ProbationTestDataItem {
  campaign?: string;
  campaign_id?: string;
  adgroup?: string;
  adgroup_id?: string;
  ad?: string;
  ad_id?: string;
  client_id?: string;
  event_name?: string;
  event_time?: string;
}
