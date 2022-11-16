export interface getQueriesError {
    success: false;
    error: string;
}

export interface getQueriesSuccess {
    success: true;
    code: string;
}

export type getQueriesType = getQueriesError | getQueriesSuccess;
