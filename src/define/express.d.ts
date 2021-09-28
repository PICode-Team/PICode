import { TAuthToken } from "../types/token.types";

export {};

declare global {
    namespace Express {
        interface Request {
            fileId?: string;
            token?: TAuthToken;
        }
    }
}
