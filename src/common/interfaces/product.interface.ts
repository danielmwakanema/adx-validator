export interface IProduct {
    productCode: string;
    productName: string;
    mappings: Array<IProductMapping>;
    dateCreated: Date;
    lastUpdated: Date;
}

interface IProductMapping {
    systemName: string;
    systemProductCode: string;
    productName: string;
}