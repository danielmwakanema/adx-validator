import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Axios, { AxiosError } from "axios";
import { MasterClientGatewayException } from "src/common/exceptions/master-client-gateway.exception";

@Injectable()
export class MasterClient {
    private logger: Logger = new Logger('Product Master Client');

    constructor(private readonly configsService: ConfigService) {}

    async productExists(code: string): Promise<boolean> {
        const host = this.configsService.get<string>('ProductMaster.host');
        const productPath = `${host}/products/${code}`;
        try {
            this.logger.log(`Attempting to find product ${productPath}.`)
            await Axios.get(productPath);
            this.logger.log(`Found product ${productPath}`);
            return true;
        } catch(error) {
            const err = error as AxiosError;
            if (err?.response?.status === 404) {
                this.logger.log(`Failed to find product ${productPath}. Product does not exist.`);
                return false;
            }
            throw new MasterClientGatewayException(`There was a problem talking to the Product Master when fetching ${code}.`);
        }
    }
}