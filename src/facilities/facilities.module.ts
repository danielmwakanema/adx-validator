import { Module } from '@nestjs/common';
import { FacilitiesService } from './facilities.service';
import { MHFRClient } from './mhfr.client';

@Module({
  providers: [FacilitiesService, MHFRClient],
  exports: [FacilitiesService],
})
export class FacilitiesModule {}
