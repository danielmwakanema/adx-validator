import { registerAs } from "@nestjs/config";

export default registerAs('ProductMaster', () => ({
    host: process.env.PRODUCT_MASTER_HOST || 'localhost'
}));