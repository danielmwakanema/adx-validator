import { registerAs } from "@nestjs/config";

export default registerAs('SuccessQueue', () => ({
    host: process.env.SQ_HOST || 'localhost',
    name: process.env.SQ_NAME || 'validator'
}));