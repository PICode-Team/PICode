interface IResultType {
    [key: number]: string;
}

export const resultType: IResultType = {
    201: "created",
    200: "ok",
    401: "invaildParameterType",
    402: "missingParameter",
    410: "notFoundSession",
    411: "invaildPasswd",
    420: "invaildRequest",
    500: "internalError",
};
