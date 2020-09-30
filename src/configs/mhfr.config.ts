import { registerAs } from "@nestjs/config";

export default registerAs('MHFR', () => ({
    host: process.env.MHFR_HOST || 'localhost'
}));