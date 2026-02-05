import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '@/core/database';
import { CampaignReportsModule } from '@/modules/campaign-reports';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    CampaignReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
