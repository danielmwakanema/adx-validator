import { registerAs } from "@nestjs/config";

export default registerAs('ValidatorQueue', () => ({
    host: process.env.VQ_HOST || 'localhost',
    name: process.env.VQ_NAME || 'validator'
}));