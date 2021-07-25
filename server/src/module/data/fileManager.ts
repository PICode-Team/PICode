import fs from "fs";
import path from "path";
import { TUploadFileLanguageToSize, TUploadManager, TUploadMimeType, TLanguageList } from "../../types/module/data/file.types";
import log from "../log";
import admZip from "adm-zip";
import DataProjectManager from "./projectManager";
import { UploadDirectoryPath } from "../../types/module/data/data.types";

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
        const onlyDirPath = path.resolve(dataPath).replace(/\\/g, "/").split("/").slice(0, -1).join("/");

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

export function searchProjectFiles(
    dir: string,
    func: {
        fileToSize?: TUploadFileLanguageToSize;
    }
) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
        let fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            searchProjectFiles(fullPath, func);
        } else if (entry.isFile()) {
            if (func.fileToSize !== undefined) {
                calculateFileSize(fullPath, func.fileToSize);
            }
        }
    });
}

export function calculateFileSize(filePath: string, fileToSize: TUploadFileLanguageToSize) {
    const fileSizeInBytes = fs.statSync(filePath).size;
    const fileLanguage = path.extname(filePath).replace(".", "").trim();
    if (TLanguageList.includes(fileLanguage)) {
        fileLanguage in fileToSize ? (fileToSize[fileLanguage] += fileSizeInBytes) : (fileToSize[fileLanguage] = fileSizeInBytes);
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
    if (isExists(newPath)) {
        return false;
    }
    const fileData = getFileInfo(oldPath);
    try {
        switch (fileData.mimetype.toLowerCase() as TUploadMimeType) {
            case "image/png":
            case "image/bmp":
            case "image/jpeg": {
                fs.renameSync(oldPath, newPath);
                //fs.renameSync(newPath, newPath.replace(getUUID(oldPath), "") + fileData.originalname);
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

export function getThumbnailfromUUID(userId: string, projectThumbnail: string) {
    if (!fs.existsSync(UploadDirectoryPath)) {
        fs.mkdirSync(UploadDirectoryPath, { recursive: true });
    }

    const projectId = fs.readdirSync(DataProjectManager.getProjectDefaultPath()).filter((projectId) => {
        DataProjectManager.getProjectInfo(projectId)?.projectThumbnail === projectThumbnail && DataProjectManager.isProjectParticipants(userId, projectId);
    });
    try {
        fs.copyFileSync(`${DataProjectManager.getProjectWorkPath(projectId[0])}${projectThumbnail}`, `${UploadDirectoryPath}/${UploadFileManager[projectThumbnail].originalname}`);
    } catch (e) {
        log.error(e.stack);
        return "";
    }
    return path.resolve(`${UploadDirectoryPath}/${UploadFileManager[projectThumbnail].originalname}`);
}

export function readCodesFromFile(serverPath: string, clientPath: string) {
    const fullPath = path.join(serverPath, clientPath);
    if (!isExists(fullPath)) return undefined;
    return fs.readFileSync(fullPath).toString();
}

export function writeCodeToFile(serverPath: string, clientPath: string, code: string) {
    const fullPath = path.join(serverPath, clientPath);
    if (!isExists(fullPath)) return false;
    try {
        fs.writeFileSync(fullPath, code);
    } catch (e) {
        log.error(e.stack);
        return false;
    }
    return true;
}

export function getAllChildren(projectPath: string, loopPath: string): TFile {
    const fullPath = path.join(projectPath, loopPath);
    const replacePath = path.join(projectPath, "");
    const children: string[] | undefined = fs.statSync(fullPath).isDirectory() ? fs.readdirSync(fullPath) : undefined;

    return { path: fullPath.replace(`${replacePath}\\`, "") + "/", children: children ? children.map((v) => getAllChildren(fullPath, v)) : undefined };
}
