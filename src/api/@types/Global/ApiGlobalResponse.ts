export type ApiGlobalResponse<T> =  {
    success : boolean;
    data : T | null;
    error: ApiError | null;
    metadata : {
        path: string;
        timestamp : string;
    }
}

export type ApiError = {
    code: string;
    message: string | null;
    details: string[];
}
