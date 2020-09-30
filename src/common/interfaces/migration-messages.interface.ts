export interface IMigrationLogMessage {
    client: string;
    clientId: string,
    channelId: string,
    migrationId: number,
    message: {
        message: string,
        service: string,
    }
}

export interface IMigrationReadyMessage {
    clientId: string,
    channelId: string,
    migrationId: number,
}

export interface IMigrationValidatedMessage {
    client: string;
    clientId: string,
    channelId: string,
    migrationId: number,
    message: {
        message: string,
        service: string,
    }
}