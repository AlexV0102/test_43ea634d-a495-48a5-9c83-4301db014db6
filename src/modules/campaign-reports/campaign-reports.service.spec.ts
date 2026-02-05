import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { CampaignReportsService } from './campaign-reports.service';
import { CAMPAIGN_REPORTS_REPOSITORY } from './repository';
import type { ICampaignReportsRepository } from './repository';
import { EventApiService } from '@/modules/event-api/event-api.service';

describe('CampaignReportsService', () => {
  let service: CampaignReportsService;
  let repository: jest.Mocked<ICampaignReportsRepository>;
  let eventApiService: jest.Mocked<EventApiService>;

  beforeEach(async () => {
    const mockRepository = {
      upsert: jest.fn().mockResolvedValue(undefined),
      getStats: jest.fn().mockResolvedValue([]),
    };
    const mockEventApiService = {
      getCampaignReportRowsForSync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignReportsService,
        {
          provide: CAMPAIGN_REPORTS_REPOSITORY,
          useValue: mockRepository,
        },
        {
          provide: EventApiService,
          useValue: mockEventApiService,
        },
      ],
    }).compile();

    service = module.get<CampaignReportsService>(CampaignReportsService);
    repository = module.get(CAMPAIGN_REPORTS_REPOSITORY);
    eventApiService = module.get(EventApiService);
    jest.clearAllMocks();
  });

  describe('syncReports', () => {
    it('should sync first page and return synced count', async () => {
      eventApiService.getCampaignReportRowsForSync.mockResolvedValue({
        rows: [
          {
            campaign: 'c',
            campaign_id: 'c1',
            adgroup: 'ag',
            adgroup_id: 'ag1',
            ad: 'a',
            ad_id: 'ad1',
            client_id: 'cl1',
            event_name: 'install',
            event_time: new Date(),
          },
        ],
      });

      const result = await service.syncReports({
        from_date: '2025-01-01',
        to_date: '2025-01-31',
        event_name: 'install',
        size: 100,
      });

      expect(eventApiService.getCampaignReportRowsForSync).toHaveBeenCalledWith({
        from_date: '2025-01-01',
        to_date: '2025-01-31',
        event_name: 'install',
        take: 100,
      });
      expect(repository.upsert).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ synced: 1 });
    });

    it('should return next token when more pages exist', async () => {
      eventApiService.getCampaignReportRowsForSync.mockResolvedValue({
        rows: [{ campaign: 'c', campaign_id: 'c1', adgroup: 'ag', adgroup_id: 'ag1', ad: 'a', ad_id: 'ad1', client_id: 'cl1', event_name: 'install', event_time: new Date() }],
        nextToken: 'token-123',
      });

      const result = await service.syncReports({
        from_date: '2025-01-01',
        to_date: '2025-01-31',
        event_name: 'install',
      });

      expect(result).toEqual({ synced: 1, next: 'token-123' });
    });

    it('should throw when first page missing from_date, to_date or event_name', async () => {
      await expect(
        service.syncReports({
          from_date: '2025-01-01',
          to_date: undefined,
          event_name: 'install',
        }),
      ).rejects.toThrow(BadRequestException);
      expect(eventApiService.getCampaignReportRowsForSync).not.toHaveBeenCalled();
    });

    it('should fetch next page when next token provided', async () => {
      eventApiService.getCampaignReportRowsForSync.mockResolvedValue({
        rows: [],
      });

      await service.syncReports({ next: 'token-456' });

      expect(eventApiService.getCampaignReportRowsForSync).toHaveBeenCalledWith({
        nextToken: 'token-456',
      });
      expect(repository.upsert).toHaveBeenCalledWith([]);
    });
  });

  describe('getStats', () => {
    it('should return stats from repository', async () => {
      const stats = [
        { ad_id: 'ad1', date: '2025-01-15', count: 5 },
        { ad_id: 'ad2', date: '2025-01-15', count: 3 },
      ];
      repository.getStats = jest.fn().mockResolvedValue(stats);

      const result = await service.getStats({
        from_date: '2025-01-01',
        to_date: '2025-01-31',
        take: 10,
        skip: 0,
      });

      expect(repository.getStats).toHaveBeenCalledWith(
        expect.any(Date),
        expect.any(Date),
        undefined,
        10,
        0,
      );
      expect(result).toEqual(stats);
    });
  });
});
