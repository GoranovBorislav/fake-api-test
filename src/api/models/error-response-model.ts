export interface ErrorResponse {
    type?: string;
    title: string;
    status: number;
    traceId: string;
    errors?: Error;
}

interface Error {
    [key: string]: string[];
}