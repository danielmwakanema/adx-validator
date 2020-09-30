import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { MigrationFileRepository } from './migration-file.repository';
import { Migration } from './migration.entity';
import { IADXPayload } from 'src/common/interfaces/adx-payload.interface';
import { now } from 'src/common/utils';

@Injectable()
export class MigrationsService {
    constructor(@InjectRepository(Migration) private readonly repository: Repository<Migration>,
                private readonly migrationFileRepository: MigrationFileRepository) {}

    async create(payload: Partial<Migration>): Promise<Migration> {
        const entity = this.repository.create(payload);
        return await this.repository.save(entity);
    }

    async update(id: number, payload: Partial<Migration>): Promise<UpdateResult> {
        return this.repository.update(id, payload);
    }

    validated(id: number): Promise<UpdateResult> {
        return this.update(id, { structureValidatedAt: now(), valuesValidatedAt: now() })
    }

    structureValidationFailed(id: number): Promise<UpdateResult> {
        return this.update(id, { structureFailedValidationAt: now() })
    }

    productsValidationFailed(id: number): Promise<UpdateResult> {
        return this.update(id, { valuesFailedValidationAt: now() });
    }

    readMigrationFile(channelId: string): IADXPayload {
        return this.migrationFileRepository.all(channelId);
    }
}
