import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import { ApiModule } from './presentation/api.module';

const ONE_MINUTE = 60000;
const ONE_HUNDRED_REQUESTS = 100;
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: ONE_MINUTE, 
        limit: ONE_HUNDRED_REQUESTS, 
      },
    ]),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            levelFirst: true,
            translateTime: true,
          },
        },
      },
    }),
    ApiModule,
  ],
})
export class AppModule {}
