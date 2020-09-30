export interface IADXPayload {
    description: string;
    'reporting-period': string;
    facilities: IADXFacilities[];
}

export interface IADXFacilities {
    'facility-code': string;
    values: IADXFacilityValues[];
}

export interface IADXFacilityValues {
    'product-code': string;
    value: number;
}