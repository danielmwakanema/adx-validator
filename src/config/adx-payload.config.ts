import { registerAs } from "@nestjs/config";

export default registerAs('AdxPayload', () => ({
    path: process.env.AVW_PAYLOADS_ROOT_DIR || 'localhost'
}));