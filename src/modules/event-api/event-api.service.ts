import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { randomUUID } from 'crypto';
import {
  ProbationTestDataResponse,
  CampaignReportRow,
  parseCsvRowToCampaignReportRow,
} from './interfaces';
import { parseCsvToRows } from '@/shared/utils';

export interface GetCampaignReportRowsResult {
  rows: CampaignReportRow[];
  next?: string;
}

export interface GetCampaignReportRowsForSyncResult {
  rows: CampaignReportRow[];
  nextToken?: string;
}

@Injectable()
export class EventApiService {
  private readonly nextUrlByToken = new Map<string, string>();

  constructor(private readonly httpService: HttpService) {}

  async getCampaignReportRowsForSync(
    options:
      | {
          from_date: string;
          to_date: string;
          event_name: string;
          take: number;
        }
      | { nextToken: string },
  ): Promise<GetCampaignReportRowsForSyncResult> {
    const result =
      'nextToken' in options
        ? await this.fetchByStoredToken(options.nextToken)
        : await this.getCampaignReportRows(
            options.from_date,
            options.to_date,
            options.event_name,
            options.take,
          );
    const { rows, next: nextUrl } = result;
    if (!nextUrl) {
      return { rows };
    }
    const token = randomUUID();
    this.nextUrlByToken.set(token, nextUrl);
    return { rows, nextToken: token };
  }

  private async fetchByStoredToken(
    token: string,
  ): Promise<GetCampaignReportRowsResult> {
    const nextUrl = this.nextUrlByToken.get(token);
    this.nextUrlByToken.delete(token);
    if (!nextUrl) {
      throw new BadRequestException('Invalid or expired sync token');
    }
    return this.getCampaignReportRowsByNext(nextUrl);
  }

  async getCampaignReportRows(
    from_date: string,
    to_date: string,
    event_name: string,
    take: number = 100,
  ): Promise<GetCampaignReportRowsResult> {
    const response = await this.fetchCampaignReportsRaw(
      from_date,
      to_date,
      event_name,
      take,
    );
    return this.parseResponseToResult(response);
  }

  async getCampaignReportRowsByNext(
    nextUrl: string,
  ): Promise<GetCampaignReportRowsResult> {
    const response = await firstValueFrom(
      this.httpService.get<ProbationTestDataResponse>(nextUrl),
    );
    return this.parseResponseToResult(response.data);
  }

  private parseResponseToResult(
    response: ProbationTestDataResponse,
  ): GetCampaignReportRowsResult {
    const csv = response.data?.csv ?? '';
    const rawRows = parseCsvToRows(csv);
    const rows = rawRows.map(parseCsvRowToCampaignReportRow);
    const next = response.data?.pagination?.next?.trim() || undefined;
    return next ? { rows, next } : { rows };
  }

  private async fetchCampaignReportsRaw(
    from_date: string,
    to_date: string,
    event_name: string,
    take: number,
  ): Promise<ProbationTestDataResponse> {
    const response = await firstValueFrom(
      this.httpService.get<ProbationTestDataResponse>(
        '/tasks/campaign/reports',
        {
          params: {
            from_date,
            to_date,
            event_name,
            take,
          },
        },
      ),
    );
    return response.data;
  }
}
