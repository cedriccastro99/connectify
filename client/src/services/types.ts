import { AxiosRequestConfig } from "axios";

export type TMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS';

export type TRequest = {
    method: TMethod;
    url: string;
    data?: any;
    options?: AxiosRequestConfig;
    signal?: any;
    headers?: Record<string, string>;
}

export type TUploadRequest = {
    url: string;
    data: FormData;
}

export type TResponse = {
    status: number;
    data: any;
    message: string;
}

export type TListParams = {
    start?: number;
    limit?: number;
    sort?: string;
    sort_by?: string;
    search?: string;
    filter?: Record<string, any>;
}