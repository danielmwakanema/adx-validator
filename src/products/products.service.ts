import { Injectable } from '@nestjs/common';
import { MasterClient } from './master.client';

@Injectable()
export class ProductsService {
    constructor(private readonly masterClient: MasterClient) {}

    productExists(code: string): Promise<boolean> {
        return this.masterClient.productExists(code);
    }
}
