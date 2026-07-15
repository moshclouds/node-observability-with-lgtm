import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from 'nestjs-pino';
import { InventoryController } from './controllers/inventory.controller';
import { InventoryService } from './services/inventory.service';
import { InventoryRepository } from './repositories/inventory.repository';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PrometheusModule, PrometheusInterceptor } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        // Generates clean JSON logs in production
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        formatters: {
          level: (label) => ({ level: label }),
        },
      },
    }),
    PrometheusModule.register(),
  ],
  controllers: [AppController, InventoryController],
  providers: [
    AppService,
    InventoryService,
    InventoryRepository,
    {
      provide: APP_INTERCEPTOR,
      useClass: PrometheusInterceptor,
    },
  ],
})
export class AppModule {}