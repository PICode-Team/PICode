import fs from "fs";
import path from "path";
import {
    TUploadFileLanguageToSize,
    TUploadManager,
    TUploadMimeType,
    TLanguageList,
} from "../../types/module/data/file.types";
import log from "../log";
import admZip from "adm-zip";

export const UploadFileManager: TUploadManager = {};

function isNormalPath(dataPath: string) {
    const projectRootPath = path.resolve(`${__dirname}/../../../../`);
    const absPath = path.resolve(path.normalize(dataPath));

    return absPath.indexOf(projectRootPath) > -1;
}

export function isExists(dataPath: string) {
    if (!isNormalPath(dataPath)) {
        return false;
    }

    return fs.existsSync(dataPath);
}

export function removeData(dataPath: string) {
    if (!isNormalPath(dataPath)) {
        return false;
    }
    try {
        fs.rmdirSync(dataPath, { recursive: true });
        return true;
    } catch (e) {
        log.error(e.stack);
        return false;
    }
}

export function getJsonData(dataPath: string) {
    try {
        if (!isNormalPath(dataPath)) {
            throw new Error("Error: Invalid path");
        }

        return JSON.parse(fs.readFileSync(dataPath).toString());
    } catch (e) {
        log.error(e.stack);
        return undefined;
    }
}

export function setJsonData(dataPath: string, data: any) {
    try {
        if (!isNormalPath(dataPath)) {
            throw new Error("Error: Invalid path");
        }
        const onlyDirPath = path
            .resolve(dataPath)
            .replace(/\\/g, "/")
            .split("/")
            .slice(0, -1)
            .join("/");

        if (!fs.existsSync(onlyDirPath)) {
            fs.mkdirSync(onlyDirPath, { recursive: true });
        }

        fs.writeFileSync(dataPath, JSON.stringify(data));
        return true;
    } catch (e) {
        log.error(e.stack);
        return false;
    }
}

export function getUUID(filePath: string) {
    return filePath.split("/")[2];
}

export function getFileInfo(filePath: string) {
    return UploadFileManager[getUUID(filePath)];
}

export function unzipFileAsync(
    zipPath: string,
    extractPath: string,
    callback: (err: Error) => void = (err) => {
        if (err) {
            log.error(err.stack);
        } else {
            fs.unlinkSync(zipPath);
        }
    }
) {
    new admZip(zipPath).extractAllToAsync(extractPath, true, callback);
}

export function findProjectLanguage(
    dir: string,
    fileToSize: TUploadFileLanguageToSize
) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
        let fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            findProjectLanguage(fullPath, fileToSize);
        } else if (entry.isFile()) {
            calculateFileSize(fullPath, fileToSize);
        } else {
        }
    });
}

export function calculateFileSize(
    filePath: string,
    fileToSize: TUploadFileLanguageToSize
) {
    const fileSizeInBytes = fs.statSync(filePath).size;
    const fileLanguage = path.extname(filePath).replace(".", "").trim();
    if (TLanguageList.includes(fileLanguage)) {
        fileLanguage in fileToSize
            ? (fileToSize[fileLanguage] += fileSizeInBytes)
            : (fileToSize[fileLanguage] = fileSizeInBytes);
    }
}

export function handle(
    oldPath: string,
    newPath: string,
    {
        isExtract,
        extractPath,
        extractCallback,
    }: {
        isExtract?: boolean;
        extractPath?: string;
        extractCallback?: (err: Error) => void;
    } = {}
) {
    const fileData = getFileInfo(oldPath);
    try {
        switch (fileData.mimetype.toLowerCase() as TUploadMimeType) {
            case "image/png":
            case "image/bmp":
            case "image/jpeg": {
                fs.renameSync(oldPath, newPath);
                break;
            }
            case "application/zip":
            case "multipart/x-zip":
            case "application/x-zip-compressed": {
                fs.renameSync(oldPath, newPath);
                if (isExtract && extractPath !== undefined) {
                    unzipFileAsync(newPath, extractPath, extractCallback);
                }
                break;
            }
            case "application/x-rar-compressed":
                break;
            default:
                return false;
        }
    } catch (e) {
        log.error(e.stack);
        return false;
    }
    return true;
}
