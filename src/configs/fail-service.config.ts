import { registerAs } from "@nestjs/config";

export default registerAs('FailQueue', () => ({
    host: process.env.FQ_HOST || 'localhost',
    name: process.env.FQ_NAME || 'validator'
}));