import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from 'nestjs-pino';
import { PaymentController } from './controllers/payment.controller';
import { PaymentService } from './services/payment.service';
import { PaymentRepository } from './repositories/payment.repository';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        // Generates clean JSON logs in production
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
      },
    }),
  ],
  controllers: [AppController, PaymentController],
  providers: [AppService, PaymentService, PaymentRepository],
})
export class AppModule {}


