import { registerAs } from "@nestjs/config";

export default registerAs('SuccessQueue', () => ({
    host: process.env.VQ_HOST || 'localhost',
    name: process.env.VQ_NAME || 'validator'
}));