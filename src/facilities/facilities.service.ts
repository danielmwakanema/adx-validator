import { Injectable } from '@nestjs/common';
import { MHFRClient } from './mhfr.client';

@Injectable()
export class FacilitiesService {
    constructor(private readonly mhfrClient: MHFRClient) {}

    facilityExists(code: string): Promise<boolean> {
        return this.mhfrClient.facilityExists(code);
    }
}
