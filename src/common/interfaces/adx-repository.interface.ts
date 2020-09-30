import { IADXPayload } from "./adx-payload.interface";

export interface IADXRepository {
    all(channelId: string): IADXPayload;
} 