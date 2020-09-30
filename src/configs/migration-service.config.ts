import { registerAs } from "@nestjs/config";

export default registerAs('MigrationQueue', () => ({
    host: process.env.MQ_HOST || 'localhost',
    name: process.env.MQ_NAME || 'validator'
}));