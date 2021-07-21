export type TUploadManager = {
    [key in string]: Express.Multer.File;
};

export type TUploadMimeType =
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
    [key in string]: string;
};

export const TLanguageList: string[] = ["c", "cpp", "cc", "m", "mm", "pl", "java", "jsp", "php", "as", "js", "ts", "asp", "cs", "py", "html", "css"];
