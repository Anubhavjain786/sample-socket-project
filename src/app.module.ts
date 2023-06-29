import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SampleGateway } from './gateways';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, SampleGateway],
})
export class AppModule {}
