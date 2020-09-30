import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import DatabaseConfig from 'src/configs/database.config';
import AdxPayloadConfig from 'src/configs/adx-payload.config';
import SuccessServiceConfig from 'src/configs/success-service.config';
import FailServiceConfig from 'src/configs/fail-service.config';
import MigrationQueueConfig from 'src/configs/migration-service.config';
import ProductMasterConfig from 'src/configs/product-master.config';
import MHFRConfig from 'src/configs/mhfr.config';
import { FAIL_CLIENT, MIGRATION_CLIENT, SUCCESS_CLIENT } from 'src/common/constants.common';
import { AppController } from './app.controller';
import { MigrationsModule } from './migrations/migrations.module';
import { ClientsModule } from './clients/clients.module';
import { ValidationsModule } from './validations/validations.module';
import { ProductsModule } from './products/products.module';
import { FacilitiesModule } from './facilities/facilities.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        DatabaseConfig,
        AdxPayloadConfig,
        SuccessServiceConfig,
        FailServiceConfig,
        ProductMasterConfig,
        MHFRConfig,
        MigrationQueueConfig
      ],
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (service: ConfigService): TypeOrmModuleOptions => ({
        type: 'mysql',
        host: service.get<string>('Database.host'),
        port: service.get<number>('Database.port'),
        username: service.get<string>('Database.user'),
        password: service.get<string>('Database.password'),
        database: service.get<string>('Database.database'),
        entities: [__dirname + '/**/*.entity{.ts,.js}']
      }),
      inject: [ConfigService]
    }),
    ValidationsModule,
    MigrationsModule,
    ClientsModule,
    ProductsModule,
    FacilitiesModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: SUCCESS_CLIENT,
      useFactory: (service: ConfigService) => {
        const host = service.get<string>('SuccessQueue.host');
        const name = service.get<string>('SuccessQueue.name');
        return ClientProxyFactory.create({ transport: Transport.RMQ, options: { urls: [host], queue: name } })
      },
      inject: [ConfigService]
    },
    {
      provide: FAIL_CLIENT,
      useFactory: (service: ConfigService) => {
        const host = service.get<string>('FailQueue.host');
        const name = service.get<string>('FailQueue.name');
        return ClientProxyFactory.create({ transport: Transport.RMQ, options: { urls: [host], queue: name } })
      },
      inject: [ConfigService]
    },
    {
      provide: MIGRATION_CLIENT,
      useFactory: (service: ConfigService) => {
        const host = service.get<string>('MigrationQueue.host');
        const name = service.get<string>('MigrationQueue.name');
        return ClientProxyFactory.create({ transport: Transport.RMQ, options: { urls: [host], queue: name } })
      },
      inject: [ConfigService]
    }
  ]
})
export class AppModule { }
