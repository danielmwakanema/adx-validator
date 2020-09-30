import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Axios, { AxiosError } from "axios";
import { MHFRClientGatewayException } from "src/common/exceptions/mhfr-client-gateway.exception";

@Injectable()
export class MHFRClient {
    private logger: Logger = new Logger('MHFR Client');

    constructor(private readonly configsService: ConfigService) {}

    async facilityExists(code: string): Promise<boolean> {
        const host = this.configsService.get<string>('MHFR.host');
        const facilityPath = `${host}/Facilities/${code}`;
        try {
            this.logger.log(`Attempting to find facility ${facilityPath}.`)
            await Axios.get(facilityPath, { timeout: 3000 });
            this.logger.log(`Found facility ${facilityPath}`);
            return true;
        } catch(error) {
            const err = error as AxiosError;
            if (err?.response?.status === 404) {
                this.logger.log(`Failed to find facility ${facilityPath}. Facility does not exist.`);
                return false;
            }
            throw new MHFRClientGatewayException(`There was a problem talking to MHFR when fetching ${code}.`);
        }
    }
}