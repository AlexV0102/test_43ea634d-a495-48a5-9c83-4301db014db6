import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import {
  PROBATION_API_BASE_URL_KEY,
  PROBATION_API_KEY_HEADER,
  PROBATION_API_KEY_ENV,
} from '@/shared/constants';
import { EventApiService } from './event-api.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        baseURL: config.get<string>(PROBATION_API_BASE_URL_KEY),
        headers: {
          [PROBATION_API_KEY_HEADER]: config.get<string>(PROBATION_API_KEY_ENV),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [EventApiService],
  exports: [EventApiService],
})
export class EventApiModule {}
