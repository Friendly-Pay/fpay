export type Country = {
    name: string;
    regions?: string[];
    iso2: string;
    countryCode: string;
    dialCode: string;
    format?: string;
    priority: number;
    mainCode?: boolean;
};