import "express-session";

declare module "express-session" {
    interface SessionData {
        userId?: string;
        userName?: string;
    }
}

declare global {
    namespace Express {
        interface Request {
            fileId?: string;
        }
    }
}
