import fs from "fs";
import path from "path";
import { TUploadFileLanguageToSize, TUploadMimeType, TLanguageList } from "../../types/module/data/file.types";
import log from "../log";
import admZip from "adm-zip";
import DataProjectManager from "./projectManager";
import DataUploadManager from "./uploadManager";
import { UploadDirectoryPath } from "../../types/module/data/data.types";
import DataUserManager from "./userManager";

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
    return DataUploadManager.UploadFileManager[getUUID(filePath)];
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

export function getThumbnailfromUUID(userId: string, thumbnail: string) {
    if (!fs.existsSync(UploadDirectoryPath)) {
        fs.mkdirSync(UploadDirectoryPath, { recursive: true });
    }

    const projectId = fs.readdirSync(DataProjectManager.getProjectDefaultPath()).filter((projectId) => {
        return (
            DataProjectManager.getProjectInfo(projectId)?.projectThumbnail === thumbnail &&
            (DataProjectManager.isProjectParticipants(userId, projectId) || DataProjectManager.isProjectCreator(userId, projectId))
        );
    });
    const userThumnail = fs.readdirSync(DataUserManager.getUserDataPath(userId)).find((UUID) => UUID === thumbnail);
    try {
        if (projectId !== undefined) {
            fs.copyFileSync(`${DataProjectManager.getProjectDataPath(projectId[0])}${thumbnail}`, `${UploadDirectoryPath}/${DataUploadManager.UploadFileManager[thumbnail].originalname}`);
        } else if (userThumnail !== undefined) {
            fs.copyFileSync(`${DataUserManager.getUserDataPath(userId)}${thumbnail}`, `${UploadDirectoryPath}/${DataUploadManager.UploadFileManager[thumbnail].originalname}`);
        }
    } catch (e) {
        log.error(e.stack);
        return "";
    }
    return path.resolve(`${UploadDirectoryPath}/${DataUploadManager.UploadFileManager[thumbnail].originalname}`);
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

export function getAllChildren(projectId: string, projectPath: string, loopPath: string): TFile {
    const fullPath = path.join(projectPath, loopPath);
    const replacePath = fullPath.replace(path.join(DataProjectManager.getProjectWorkPath(projectId)).replace(".", ""), "");
    const children: string[] | undefined = fs.statSync(fullPath).isDirectory() ? fs.readdirSync(fullPath) : undefined;

    return { path: replacePath !== "" ? replacePath : "/", children: children ? children.map((v) => getAllChildren(projectId, fullPath, v)) : undefined };
}
