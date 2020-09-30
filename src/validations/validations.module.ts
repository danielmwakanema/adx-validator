import { Module } from '@nestjs/common';
import { ClientsModule } from 'src/clients/clients.module';
import { FacilitiesModule } from 'src/facilities/facilities.module';
import { MigrationsModule } from 'src/migrations/migrations.module';
import { ProductsModule } from 'src/products/products.module';
import { ValidationsService } from './validations.service';

@Module({
  imports: [ClientsModule, ProductsModule, MigrationsModule, FacilitiesModule],
  providers: [ValidationsService],
  exports: [ValidationsService]
})
export class ValidationsModule {}
