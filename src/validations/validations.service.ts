import { Injectable } from '@nestjs/common';
import { ClientsService } from 'src/clients/clients.service';
import { InvalidADXSchemaException } from 'src/common/exceptions/invalid-adx-schema.exception';
import { MissingClientException } from 'src/common/exceptions/missing-client.exception';
import { MissingFacilityException } from 'src/common/exceptions/missing-facility.exception';
import { MissingProductException } from 'src/common/exceptions/missing-product.exception';
import { IADXFacilityValues, IADXPayload } from 'src/common/interfaces/adx-payload.interface';
import { IQueueMessage } from 'src/common/interfaces/queue-message.interface';
import { AdxPayloadSchema } from 'src/common/schema/adx-payload.schema';
import { FacilitiesService } from 'src/facilities/facilities.service';
import { MigrationsService } from 'src/migrations/migrations.service';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class ValidationsService {
    constructor(private readonly productsService: ProductsService,
        private readonly facilitiesService: FacilitiesService,
        private readonly migrationsService: MigrationsService,
        private readonly clientsService: ClientsService) { }

    async validateMigration(message: IQueueMessage): Promise<void> {
        const { clientId, channelId } = message;

        const client = await this.clientsService.findById(clientId);
        if (!client) throw new MissingClientException(`Client with id ${clientId} was not found.`);

        const data = this.migrationsService.readMigrationFile(channelId);
        const { error } = AdxPayloadSchema.validate(data);
        if (error) throw new InvalidADXSchemaException(`The schema for ${channelId}'s ADX file is invalid.`);

        if (!await this.productsExist(data)) throw new MissingProductException(`One or more products in ${channelId}'s file was not found.`);
        if (!await this.facilitiesExist(data)) throw new MissingFacilityException(`One or more facilities in ${channelId}'s file was not found.`);
    }

    private async productsExist(payload: IADXPayload): Promise<boolean> {
        const codes = payload.facilities
            .reduce((acc, val): Array<IADXFacilityValues> => [...acc, ...val.values], [])
            .map((product): string => product['product-code']);
        const promises = await Promise.all(codes.map(val => this.productsService.productExists(val)));
        return promises.reduce((acc, val) => acc && val, true);
    }

    private async facilitiesExist(payload: IADXPayload): Promise<boolean> {
        const codes = payload.facilities.map(facility => facility['facility-code']);
        const promises = await Promise.all(codes.map(code => this.facilitiesService.facilityExists(code)));
        return promises.reduce((acc, val) => acc && val, true);
    }
}
