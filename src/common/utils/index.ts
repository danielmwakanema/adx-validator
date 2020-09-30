import { IMigrationLogMessage } from "../interfaces/migration-messages.interface";
import { IQueueMessage } from "../interfaces/queue-message.interface";

export function now(): string {
    return (new Date()).toString();
}

export function failPayload(data: IQueueMessage, error: Error): IMigrationLogMessage {
    return {
        client: data.clientId,
        ...data,
        message: {
            message: error.message, 
            service: 'validation'
        }
    };
}

export function finishPayload(data: IQueueMessage): IMigrationLogMessage {
    return {
        client: data.clientId,
        ...data,
        message: {
            message: 'Finished payload structure and content validation', 
            service: 'validation'
        }
    };
}