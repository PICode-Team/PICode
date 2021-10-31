import { TReturnData } from "../../data.types";

export type TUploadManager = {
    [key in string]: Express.Multer.File;
};

export type TUploadMimeType =
    | "image/svg+xml"
    | "image/png"
    | "image/png"
    | "image/jpeg"
    | "image/bmp"
    | "application/x-zip-compressed"
    | "application/x-rar-compressed"
    | "application/octet-stream"
    | "application/zip"
    | "application/octet-stream"
    | "multipart/x-zip";

export type TUploadFileLanguageToSize = {
    [key in string]: number;
};

export type TFileData = {
    filePath?: string;
    fileContent?: string;
    rowInfo?: Record<string, number>;
};

export interface TFile {
    path?: string;
    children?: TFile[] | undefined;
}

export type TReturnFileData = TReturnData & {
    path?: string;
};

export const TLanguageList: string[] = ["c", "cpp", "cc", "m", "mm", "pl", "java", "jsp", "php", "as", "js", "ts", "asp", "cs", "py", "html", "css"];
