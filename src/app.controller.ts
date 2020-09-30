import { Controller, Inject, Logger } from '@nestjs/common';
import { ClientProxy, Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { InvalidADXSchemaException } from './common/exceptions/invalid-adx-schema.exception';
import { MissingClientException } from './common/exceptions/missing-client.exception';
import { MissingFacilityException } from './common/exceptions/missing-facility.exception';
import { MissingMigrationFileException } from './common/exceptions/missing-migration-file.exception';
import { MissingProductException } from './common/exceptions/missing-product.exception';
import { IQueueMessage } from './common/interfaces/queue-message.interface';
import { MigrationsService } from './migrations/migrations.service';
import { ValidationsService } from './validations/validations.service';
import { FAIL_CLIENT, MIGRATION_CLIENT, MIGRATION_FAILED, MIGRATION_READY, MIGRATION_VALIDATED, SUCCESS_CLIENT } from './common/constants.common';
import { MasterClientGatewayException } from './common/exceptions/master-client-gateway.exception';
import { MHFRClientGatewayException } from './common/exceptions/mhfr-client-gateway.exception';
import { IMigrationLogMessage, IMigrationReadyMessage, IMigrationValidatedMessage } from './common/interfaces/migration-messages.interface';
import { failPayload, finishPayload } from './common/utils';

@Controller()
export class AppController {
    private logger: Logger = new Logger();

    constructor(private readonly migrationsService: MigrationsService,
        private readonly validationsService: ValidationsService,
        @Inject(SUCCESS_CLIENT) private successClient: ClientProxy,
        @Inject(FAIL_CLIENT) private failClient: ClientProxy,
        @Inject(MIGRATION_CLIENT) private migrationClient: ClientProxy) { }

    @EventPattern()
    async consume(@Payload() data: IQueueMessage, @Ctx() ctx: RmqContext): Promise<void> {
        const { clientId, channelId } = data;
        const migration = await this.migrationsService.create({ channelId, clientId });

        try {
            await this.validationsService.validateMigration(data);
            this.migrationsService.validated(migration.id)
            this.successClient.emit<IMigrationValidatedMessage>(MIGRATION_VALIDATED, finishPayload(data));
            data.migrationId = migration.id;
            this.migrationClient.emit<IMigrationReadyMessage>(MIGRATION_READY, data);
            ctx.getChannelRef().ack(ctx.getMessage());
        } catch (error) {
            if (error instanceof MissingProductException) {
                await this.migrationsService.productsValidationFailed(migration.id);
            }

            if (error instanceof MissingClientException) {
                await this.migrationsService.productsValidationFailed(migration.id);
            }

            if (error instanceof MissingFacilityException) {
                await this.migrationsService.productsValidationFailed(migration.id);
            }

            if (error instanceof MissingMigrationFileException) {
                await this.migrationsService.structureValidationFailed(migration.id);
            }

            if (error instanceof InvalidADXSchemaException) {
                await this.migrationsService.structureValidationFailed(migration.id);
            }

            if (error instanceof MasterClientGatewayException) {
                await this.migrationsService.structureValidationFailed(migration.id);
            }

            if (error instanceof MHFRClientGatewayException) {
                await this.migrationsService.structureValidationFailed(migration.id);
            }
            this.logger.error(`An error occured: ${error}`);
            this.failClient.emit<IMigrationLogMessage>(MIGRATION_FAILED, failPayload(data, error));
        }
    }
}