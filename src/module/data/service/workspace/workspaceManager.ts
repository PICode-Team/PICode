import log from "../../../log";
import { UploadDirectoryPath, WorkDirectoryPath, DataDirectoryPath, StaticDirectoryPath, TReturnData } from "../../../../types/module/data/data.types";
import { TWorkspaceCreateData, TWorkspaceUpdateData, TWorkspaceData } from "../../../../types/module/data/service/workspace/workspace.type";
import { setJsonData, getJsonData, isExists, removeData, handle, searchWorkspaceFiles, readCodesFromFile, writeCodeToFile, getAllChildren } from "../etc/fileManager";
import DataUploadManager from "../etc/uploadManager";
import fs from "fs";
import simpleGit from "simple-git";
import { zip } from "zip-a-folder";
import { TFile, TFileData, TReturnFileData, TUploadFileLanguageToSize } from "../../../../types/module/data/service/etc/file.types";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { TDockerCreateData, TDockerUpdateData } from "../../../../types/module/data/service/workspace/docker.types";
import DataDockerManager from "./dockerManager";
import { ResponseCode } from "../../../../constants/response";

const workspaceFileName = "workspaceInfo.json";

export default class DataWorkspaceManager {
    static isExists(workspaceId: string, workspacePath: (workspaceId: string, type?: undefined) => string) {
        return isExists(workspacePath(workspaceId));
    }

    static getWorkspaceDefaultPath() {
        return `${DataDirectoryPath}/workspace`;
    }

    static getWorkspaceWorkPath(workspaceId: string) {
        return `${WorkDirectoryPath}/workspace/${workspaceId}`;
    }

    static getWorkspaceDataPath(workspaceId: string) {
        return `${DataDirectoryPath}/workspace/${workspaceId}`;
    }

    static getWorkspaceInfo(workspaceId: string) {
        const defaultPath = this.getWorkspaceDataPath(workspaceId);
        const workspacePath = `${defaultPath}/${workspaceFileName}`;
        if (!isExists(workspacePath)) {
            return undefined;
        }

        return getJsonData(workspacePath) as TWorkspaceData;
    }

    static setWorkspaceInfo(workspaceId: string, data: TWorkspaceData | TWorkspaceCreateData | TWorkspaceUpdateData) {
        const defaultPath = this.getWorkspaceDataPath(workspaceId);
        const workspacePath = `${defaultPath}/${workspaceFileName}`;
        if (!isExists(workspacePath)) {
            return undefined;
        }

        return setJsonData(workspacePath, data);
    }

    static compareWorkspaceName(workspaceId: string, workspaceName?: string) {
        return (this.getWorkspaceInfo(workspaceId) as TWorkspaceData).name === workspaceName;
    }

    static isWorkspaceCreator(userId: string, workspaceId: string) {
        return (this.getWorkspaceInfo(workspaceId) as TWorkspaceData).creator === userId;
    }

    static isWorkspaceParticipants(userId: string, workspaceId: string) {
        return ((this.getWorkspaceInfo(workspaceId) as TWorkspaceData).participants as string[]).includes(userId);
    }

    static canEditWorkspace(userId: string, workspaceId: string, participantIncluded: boolean) {
        return this.isWorkspaceCreator(userId, workspaceId) || participantIncluded ? this.isWorkspaceParticipants(userId, workspaceId) : false;
    }

    static getWorkspaceId(userId: string, workspaceName: string) {
        return fs.readdirSync(this.getWorkspaceDefaultPath()).find((workspaceId) => {
            const workspaceInfo = this.getWorkspaceInfo(workspaceId);
            return workspaceInfo ? (workspaceInfo.creator === userId || workspaceInfo.participants?.includes(userId)) && workspaceInfo.name === workspaceName : false;
        });
    }

    static isValidAuth(userId: string, workspaceName: string, participantIncluded: boolean) {
        const workspaceId = this.getWorkspaceId(userId, workspaceName);
        if (workspaceId === undefined) {
            return false;
        }
        if (!this.canEditWorkspace(userId, workspaceId, participantIncluded)) {
            return false;
        }
        return true;
    }

    static gitCloneFromURL(
        workspaceId: string,
        source: {
            gitUrl?: string;
        }
    ) {
        const clonePath = DataWorkspaceManager.getWorkspaceWorkPath(workspaceId);
        if (!fs.existsSync(clonePath)) {
            fs.mkdirSync(clonePath, { recursive: true });
        }
        try {
            if (source.gitUrl === undefined) {
                log.error(`invalid git URL`);
                return false;
            }
            simpleGit()
                .clone(source.gitUrl, clonePath)
                .then(() => {
                    const fileToSize: TUploadFileLanguageToSize = {};
                    const workspaceInfo = DataWorkspaceManager.getWorkspaceInfo(workspaceId);
                    if (workspaceInfo === undefined) {
                        throw new Error(`could not find workspaceInfo`);
                    }
                    searchWorkspaceFiles(clonePath, { fileToSize: fileToSize }),
                        DataWorkspaceManager.setWorkspaceInfo(workspaceId, {
                            ...workspaceInfo,
                            workspaceLanguage: fileToSize,
                        } as TWorkspaceUpdateData);
                    log.info(`git clone complete gitUrl: ${source.gitUrl}`);
                })
                .catch((e) => {
                    log.error(e.stack);
                });
        } catch (e: any) {
            log.error(e.stack);
            return false;
        }
        return true;
    }

    static createworkspaceFromFile(
        workspaceId: string,
        source: {
            upload: {
                uploadFileId: string;
                isExtract?: boolean;
            };
        }
    ) {
        const uploadFileId = source.upload.uploadFileId;
        const isExtract = source.upload.isExtract;
        const fileName = DataUploadManager.UploadFileManager[uploadFileId].originalname;
        const newPath = DataWorkspaceManager.getWorkspaceWorkPath(workspaceId);
        if (!fs.existsSync(newPath)) {
            fs.mkdirSync(newPath, { recursive: true });
        }
        return handle(`${UploadDirectoryPath}/${uploadFileId}`, `${newPath}/${fileName}`, {
            isExtract: isExtract,
            extractPath: isExtract ? newPath : undefined,
            extractCallback: (err) => {
                if (err) {
                    log.error(err.stack);
                } else {
                    fs.unlinkSync(`${newPath}/${fileName}`);
                    const fileToSize: TUploadFileLanguageToSize = {};
                    searchWorkspaceFiles(newPath, { fileToSize: fileToSize });
                    DataWorkspaceManager.setWorkspaceInfo(workspaceId, {
                        ...DataWorkspaceManager.getWorkspaceInfo(workspaceId),
                        workspaceLanguage: fileToSize,
                    } as TWorkspaceUpdateData);
                    DataUploadManager.deleteUploadFileInfo(uploadFileId);
                }
            },
        })
            ? true
            : false;
    }

    static createEmptyworkspace(workspaceId: string, source: any) {
        if (source.type !== "nothing") {
            return false;
        }
        if (!fs.existsSync(DataWorkspaceManager.getWorkspaceWorkPath(workspaceId))) {
            fs.mkdirSync(DataWorkspaceManager.getWorkspaceWorkPath(workspaceId), {
                recursive: true,
            });
        }
        return true;
    }

    /**
     *
     * @param userId : user ID from session
     * @param workspaceName : workspace name that you want to get infomation
     * @description : get workspaceInfo or workspaceInfoList
     * @returns workspaceInfo if you input workspaceName, or workspaceList
     *
     */
    static get(userId: string, workspaceId?: string) {
        DataUploadManager.loadUploadFileInfo();
        if (!fs.existsSync(this.getWorkspaceDefaultPath())) {
            fs.mkdirSync(this.getWorkspaceDefaultPath(), { recursive: true });
        }

        return fs
            .readdirSync(this.getWorkspaceDefaultPath())
            .filter((workspaceUUID) => {
                return this.canEditWorkspace(userId, workspaceUUID, true) && (workspaceId === undefined || workspaceId === workspaceUUID);
            })
            .map((workspaceUUID) => {
                return { ...(this.getWorkspaceInfo(workspaceUUID) as TWorkspaceData), ...DataDockerManager.getDockerInfo(workspaceUUID) };
            });
    }

    /**
     *
     * @param userId : user ID from session
     * @param { name, description, thumbnail, participants } : infomation that create workspace
     * @param dockerInfo : information that create container
     * @param source : Information on how to create a workspace.
     * @description create workspace with container
     * @returns {code, message? } : code based on the result and message if function has error
     */
    static create(
        userId: string,
        { name, description, thumbnail, participants }: TWorkspaceCreateData,
        dockerInfo: TDockerCreateData,
        source: {
            type: "gitUrl" | "upload" | "nothing";
            gitUrl?: string;
            upload?: {
                uploadFileId: string;
                isExtract?: boolean;
            };
        }
    ): TReturnData {
        if (!fs.existsSync(this.getWorkspaceDefaultPath())) {
            fs.mkdirSync(this.getWorkspaceDefaultPath(), { recursive: true });
        }

        if (this.getWorkspaceId(userId, name) !== undefined) {
            return { code: ResponseCode.confilct, message: "The same workspace name already exists." };
        }
        const func: Record<string, (workspaceId: string, source: any) => boolean> = {
            gitUrl: this.gitCloneFromURL,
            upload: this.createworkspaceFromFile,
            nothing: this.createEmptyworkspace,
        };
        try {
            DataUploadManager.loadUploadFileInfo();
            const workspaceId = uuidv4();

            fs.mkdirSync(this.getWorkspaceDataPath(workspaceId), { recursive: true });

            if (thumbnail !== undefined) {
                if (!fs.existsSync(StaticDirectoryPath)) {
                    fs.mkdirSync(StaticDirectoryPath, {
                        recursive: true,
                    });
                }
                const extension = DataUploadManager.UploadFileManager[thumbnail].originalname.split(".").pop();
                if (!handle(`${UploadDirectoryPath}/${thumbnail}`, `${StaticDirectoryPath}/${thumbnail}.${extension}`)) {
                    return { code: ResponseCode.internalError, message: "Failed to handle thumbnail image" };
                }
                thumbnail = `${thumbnail}.${extension}`;
                DataUploadManager.deleteUploadFileInfo(thumbnail);
            }
            const workspaceParticipants = participants ? [...participants, userId] : [userId];
            this.setWorkspaceInfo(workspaceId, {
                workspaceId: workspaceId,
                name: name,
                description: description,
                thumbnail: thumbnail,
                creator: userId,
                participants: workspaceParticipants,
            });

            if (func?.[source.type](workspaceId, source) !== true) {
                return { code: ResponseCode.internalError, message: `Failed to create workspace with ${source.type}` };
            }
            DataDockerManager.create(userId, dockerInfo, { workspaceId, workspaceName: name, workspaceParticipants });
        } catch (err: any) {
            log.error(err.stack);
            return { code: ResponseCode.internalError, message: "Error occured" };
        }
        return { code: ResponseCode.ok };
    }

    static update(userId: string, workspaceId: string, participantIncluded: boolean, workspaceInfo: TWorkspaceUpdateData, dockerInfo: TDockerUpdateData): TReturnData {
        DataUploadManager.loadUploadFileInfo();
        const workspaceData = this.getWorkspaceInfo(workspaceId);
        if (workspaceData === undefined) {
            return { code: ResponseCode.invaildRequest, message: "Could not find workspace" };
        }

        if (!this.canEditWorkspace(userId, workspaceId, participantIncluded)) {
            return { code: ResponseCode.forbidden, message: "No authority to modify this workspace" };
        }

        try {
            if (workspaceInfo.thumbnail !== undefined && path.parse(workspaceData.thumbnail as string).name !== workspaceInfo.thumbnail) {
                const extension = DataUploadManager.UploadFileManager[workspaceInfo.thumbnail].originalname.split(".").pop();
                if (!handle(`${UploadDirectoryPath}/${workspaceInfo.thumbnail}`, `${StaticDirectoryPath}/${workspaceInfo.thumbnail}.${extension}`)) {
                    return { code: ResponseCode.internalError, message: "Failed to handle thumbnail image" };
                }
                if (workspaceData.thumbnail !== undefined) {
                    fs.unlinkSync(`${StaticDirectoryPath}/${workspaceData.thumbnail}`);
                }
                workspaceData.thumbnail = `${workspaceInfo.thumbnail}.${extension}`;
                DataUploadManager.deleteUploadFileInfo(workspaceInfo.thumbnail);
            }
            if (
                !this.setWorkspaceInfo(workspaceId, {
                    workspaceId,
                    name: workspaceInfo.name ?? workspaceData.name,
                    description: workspaceInfo.description ?? workspaceData.description,
                    thumbnail: workspaceInfo.thumbnail ?? workspaceData.thumbnail,
                    language: workspaceData.language,
                    creator: workspaceData.creator,
                    participants: workspaceInfo.participants ?? workspaceData.participants,
                })
            ) {
                return { code: ResponseCode.internalError, message: "Could not update workspace infomation" };
            }
            DataDockerManager.update(userId, workspaceId, dockerInfo);
        } catch (e: any) {
            log.error(e.stack);
            return { code: ResponseCode.internalError, message: "Error occured" };
        }
        return { code: ResponseCode.ok };
    }

    static delete(userId: string, workspaceId: string): TReturnData {
        if (!this.canEditWorkspace(userId, workspaceId, false)) {
            return { code: ResponseCode.forbidden, message: "No authority to delete this workspace" };
        }
        if (!DataDockerManager.delete(userId, workspaceId)) {
            return { code: ResponseCode.internalError, message: "Error occured from container" };
        }
        if (!this.isExists(workspaceId, this.getWorkspaceWorkPath) || !removeData(this.getWorkspaceWorkPath(workspaceId))) {
            return { code: ResponseCode.internalError, message: "Failed to remove workspace data" };
        }
        return { code: ResponseCode.ok };
    }

    static export(userId: string, workspaceName: string) {
        const workspaceId = this.getWorkspaceId(userId, workspaceName);
        if (workspaceId === undefined) {
            return false;
        }
        try {
            zip(this.getWorkspaceWorkPath(workspaceId), `${this.getWorkspaceWorkPath(workspaceId)}/${workspaceName}.zip`);
        } catch (e: any) {
            log.error(e.stack);
            return false;
        }
        return true;
    }

    static getCodesFromWorkspace(userId: string, { workspaceId, filePath }: { workspaceId: string; filePath: string }) {
        if (workspaceId === undefined) {
            return { message: "could not find workspace" };
        }
        if (!this.canEditWorkspace(userId, workspaceId, true)) {
            return { message: "could not edit workspace" };
        }
        const fileData: TFileData = {};
        const codeData = readCodesFromFile(this.getWorkspaceWorkPath(workspaceId), filePath);
        if (codeData !== undefined) {
            fileData["filePath"] = filePath;
            fileData["fileContent"] = codeData;
        }
        return fileData;
    }

    static changeWorkspaceCode(userId: string, { workspaceId, filePath, code }: { workspaceId: string; filePath: string; code: string }): TReturnFileData {
        if (workspaceId === undefined) {
            return { code: ResponseCode.missingParameter };
        }
        if (!this.canEditWorkspace(userId, workspaceId, true)) {
            return { code: ResponseCode.invaildRequest };
        }

        if (!writeCodeToFile(this.getWorkspaceWorkPath(workspaceId), filePath, code)) {
            return { code: ResponseCode.internalError };
        }
        return { code: ResponseCode.ok, path: filePath };
    }

    static moveWorkspaceFileOrDir(userId: string, { workspaceId, oldPath, newPath }: { workspaceId: string; oldPath: string; newPath: string }): TReturnFileData {
        if (workspaceId === undefined) {
            return { code: ResponseCode.missingParameter };
        }
        if (!this.canEditWorkspace(userId, workspaceId, true)) {
            return { code: ResponseCode.invaildRequest };
        }
        const fullOldPath = path.join(this.getWorkspaceWorkPath(workspaceId), oldPath);
        const fullNewPath = path.join(this.getWorkspaceWorkPath(workspaceId), newPath);
        if (!isExists(fullOldPath)) {
            return { code: ResponseCode.internalError };
        }
        try {
            fs.renameSync(fullOldPath, fullNewPath);
        } catch (e: any) {
            log.error(e.stack);
            return { code: ResponseCode.internalError };
        }
        return { code: ResponseCode.ok, path: newPath };
    }

    static deleteFileOrDir(userId: string, { workspaceId, deletePath, recursive }: { workspaceId: string; deletePath: string; recursive?: boolean }): TReturnFileData {
        if (workspaceId === undefined) {
            return { code: ResponseCode.missingParameter };
        }
        if (!this.canEditWorkspace(userId, workspaceId, true)) {
            return { code: ResponseCode.invaildRequest };
        }
        try {
            const fullPath = path.join(this.getWorkspaceWorkPath(workspaceId), deletePath);
            if (fs.statSync(fullPath).isDirectory()) {
                fs.rmdirSync(fullPath, { recursive: recursive });
            } else if (fs.statSync(fullPath).isFile()) {
                fs.unlinkSync(fullPath);
            }
        } catch (e: any) {
            log.error(e.stack);
            return { code: ResponseCode.internalError };
        }
        return { code: ResponseCode.ok, path: deletePath };
    }
    static createWorkspaceFile(userId: string, { workspaceId, filePath }: { workspaceId: string; filePath: string }): TReturnFileData {
        if (workspaceId === undefined) {
            return { code: ResponseCode.missingParameter };
        }
        if (!this.canEditWorkspace(userId, workspaceId, true)) {
            return { code: ResponseCode.invaildRequest };
        }
        try {
            const fullPath = path.join(this.getWorkspaceWorkPath(workspaceId), filePath);
            fs.openSync(fullPath, "w");
        } catch (e: any) {
            log.error(e.stack);
            return { code: ResponseCode.internalError };
        }
        return { code: ResponseCode.ok, path: filePath };
    }
    static createWorkspaceDir(userId: string, { workspaceId, dirPath }: { workspaceId: string; dirPath: string }): TReturnFileData {
        if (workspaceId === undefined) {
            return { code: ResponseCode.missingParameter };
        }
        if (!this.canEditWorkspace(userId, workspaceId, true)) {
            return { code: ResponseCode.invaildRequest };
        }
        try {
            const fullPath = path.join(this.getWorkspaceWorkPath(workspaceId), dirPath);
            fs.mkdirSync(fullPath, { recursive: true });
        } catch (e: any) {
            log.error(e.stack);
            return { code: ResponseCode.internalError };
        }
        return { code: ResponseCode.ok, path: dirPath };
    }

    static getAllWorkspacePath(userId: string, workspaceId: string): TFile | TReturnData {
        if (workspaceId === undefined) {
            return { code: ResponseCode.missingParameter };
        }
        if (!this.canEditWorkspace(userId, workspaceId, true)) {
            return { code: ResponseCode.invaildRequest };
        }
        const workspacePath = DataWorkspaceManager.getWorkspaceWorkPath(workspaceId);
        return getAllChildren(workspaceId, workspacePath, "/");
    }
}
