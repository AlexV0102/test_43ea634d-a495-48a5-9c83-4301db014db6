import { Test, TestingModule } from '@nestjs/testing';
import { CampaignReportsController } from './campaign-reports.controller';
import { CampaignReportsService } from './campaign-reports.service';

describe('CampaignReportsController', () => {
  let controller: CampaignReportsController;
  let service: CampaignReportsService;

  beforeEach(async () => {
    const mockService = {
      syncReports: jest.fn(),
      getStats: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CampaignReportsController],
      providers: [
        {
          provide: CampaignReportsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<CampaignReportsController>(CampaignReportsController);
    service = module.get<CampaignReportsService>(CampaignReportsService);
    jest.clearAllMocks();
  });

  describe('sync', () => {
    it('should return sync result from service', async () => {
      const dto = {
        from_date: '2025-01-01',
        to_date: '2025-01-31',
        event_name: 'install' as const,
        size: 100,
      };
      const expected = { synced: 42 };
      jest.spyOn(service, 'syncReports').mockResolvedValue(expected);

      const result = await controller.sync(dto);

      expect(service.syncReports).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  describe('stats', () => {
    it('should return stats from service', async () => {
      const dto = {
        from_date: '2025-01-01',
        to_date: '2025-01-31',
        take: 10,
        skip: 0,
      };
      const expected = [
        { ad_id: 'ad1', date: '2025-01-15', count: 5 },
      ];
      jest.spyOn(service, 'getStats').mockResolvedValue(expected);

      const result = await controller.stats(dto);

      expect(service.getStats).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });
});
