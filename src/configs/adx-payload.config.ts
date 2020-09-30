import { registerAs } from "@nestjs/config";

export default registerAs('ADXPayload', () => ({
    path: process.env.VW_PAYLOADS_ROOT_DIR || 'localhost'
}));