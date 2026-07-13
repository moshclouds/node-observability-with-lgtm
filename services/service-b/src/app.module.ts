import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        // Generates clean JSON logs in production
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

