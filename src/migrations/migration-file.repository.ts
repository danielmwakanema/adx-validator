import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { join } from "path";
import { existsSync, readFileSync } from 'fs';
import { IADXPayload } from "src/common/interfaces/adx-payload.interface";
import { IADXRepository } from "src/common/interfaces/adx-repository.interface";
import { MissingMigrationFileException } from "src/common/exceptions/missing-migration-file.exception";

@Injectable()
export class MigrationFileRepository implements IADXRepository {
    constructor(private readonly configService: ConfigService) { }

    all(channelId: string): IADXPayload {
        const adxFileStore = this.configService.get<string>('ADXPayload.path');
        const path = join(`${adxFileStore}`, `${channelId}.adx`);
        if (!existsSync(path)) throw new MissingMigrationFileException(`ADX file for ${channelId} was not found.`);
        const data = readFileSync(path, { encoding: 'utf-8' });
        return JSON.parse(data) as IADXPayload;
    }
}