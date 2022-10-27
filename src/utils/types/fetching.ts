export type Method = "GET" | "POST" | "DELETE" | "PUT" | "PATCH";

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

export interface SuccessResponse<T> {
    successful: true;
    data: T;
}

export interface ErrorResponse {
    successful: false;
    error: string;
}