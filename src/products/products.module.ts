import { Module } from '@nestjs/common';
import { MasterClient } from './master.client';
import { ProductsService } from './products.service';

@Module({
  providers: [ProductsService, MasterClient],
  exports: [ProductsService]
})
export class ProductsModule {}
