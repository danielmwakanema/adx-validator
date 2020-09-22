import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import DatabaseConfig from 'src/config/database.config';
import ValidatorQueueConfig from 'src/config/validator-queue.config';
import FailQueueConfig from 'src/config/fail-queue.config';
import SuccessQueueConfig from 'src/config/success-queue.config';
import AdxPayloadConfig from 'src/config/adx-payload.config';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [DatabaseConfig, ValidatorQueueConfig, FailQueueConfig, SuccessQueueConfig, AdxPayloadConfig], isGlobal: true })
  ]
})
export class AppModule { }
