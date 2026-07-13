import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from 'nestjs-pino';
import { PaymentController } from './controllers/payment.controller';
import { PaymentService } from './services/payment.service';
import { PaymentRepository } from './repositories/payment.repository';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PrometheusModule, PrometheusInterceptor } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        // Generates clean JSON logs in production
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
      },
    }),
    PrometheusModule.register(),
  ],
  controllers: [AppController, PaymentController],
  providers: [
    AppService,
    PaymentService,
    PaymentRepository,
    {
      provide: APP_INTERCEPTOR,
      useClass: PrometheusInterceptor,
    },
  ],
})
export class AppModule {}



