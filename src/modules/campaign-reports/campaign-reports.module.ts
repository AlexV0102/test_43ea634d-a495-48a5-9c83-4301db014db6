import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaignReportEntity } from './entities';
import { CampaignReportsRepository } from './repository';
import { CAMPAIGN_REPORTS_REPOSITORY } from './repository/campaign-reports.repository.interface';
import { CampaignReportsController } from './campaign-reports.controller';
import { CampaignReportsService } from './campaign-reports.service';
import { EventApiModule } from '@/modules/event-api';

@Module({
  imports: [TypeOrmModule.forFeature([CampaignReportEntity]), EventApiModule],
  controllers: [CampaignReportsController],
  providers: [
    CampaignReportsService,
    {
      provide: CAMPAIGN_REPORTS_REPOSITORY,
      useClass: CampaignReportsRepository,
    },
  ],
})
export class CampaignReportsModule {}
