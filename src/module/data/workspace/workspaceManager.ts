import log from "../../log";
import {
    UploadDirectoryPath,
    WorkDirectoryPath,
    DataDirectoryPath,
    TReturnData,
    ExportDirectoryPath,
} from "../../../types/module/data/data.types";
import {
    TWorkspaceCreateData,
    TWorkspaceUpdateData,
    TWorkspaceData,
    TReturnWorkspaceData,
} from "../../../types/module/data/service/workspace/workspace.type";
import { setJsonData, getJsonData, isExists, removeData, handle, searchWorkspaceFiles } from "../etc/fileManager";
import DataUploadManager from "../etc/uploadManager";
import fs from "fs";
import simpleGit from "simple-git";
import { zip } from "zip-a-folder";
import { TUploadFileLanguageToSize } from "../../../types/module/data/service/etc/file.types";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { TDockerCreateData, TDockerUpdateData } from "../../../types/module/data/service/workspace/docker.types";
import DataDockerManager from "./dockerManager";
import { ResponseCode } from "../../../constants/response";
import { getTime } from "../../datetime";
import os from "os";
import DataAlarmManager from "../alarm/alarmManager";

const workspaceFileName = "workspaceInfo.json";

export default class DataWorkspaceManager {
    /**
     *
     * @param workspaceId ID that you want to know if workspace's path exists
     * @param workspacePath function that you want to know if workspace's path exists
     * @description check if path exists
     * @returns true if path exists, false if not
     */
    static isExists(workspaceId: string, workspacePath: (workspaceId: string) => string) {
        return isExists(workspacePath(workspaceId));
    }

    /**
     *
     * @description get workspace data path
     * @returns path that workspace data path
     */
    static getWorkspaceDefaultPath() {
        return `${DataDirectoryPath}/workspace`;
    }

    /**
     *
     * @param workspaceId ID that you want to get work path of ID's workspace
     * @description get ID's workspace work path
     * @returns ID's workspace work path
     */
    static getWorkspaceWorkPath(workspaceId: string) {
        return `${WorkDirectoryPath}/workspace/${workspaceId}`;
    }

    /**
     *
     * @param workspaceId ID that you want to get data path of ID's workspace
     * @description get ID's workspace data path
     * @returns ID's workspace data path
     */
    static getWorkspaceDataPath(workspaceId: string) {
        return `${DataDirectoryPath}/workspace/${workspaceId}`;
    }

    /**
     *
     * @param workspaceId ID that you want to get workspace infomation of ID's workspace
     * @description get ID's workspace infomation
     * @returns ID's workspace infomation
     */
    static getWorkspaceInfo(workspaceId: string) {
        const defaultPath = this.getWorkspaceDataPath(workspaceId);
        const workspacePath = `${defaultPath}/${workspaceFileName}`;
        if (!isExists(workspacePath)) {
            return undefined;
        }

        return getJsonData(workspacePath) as TWorkspaceData;
    }

    /**
     *
     * @param workspaceId ID that you want to set workspace infomation of ID's workspace
     * @param data data that you want to set workspace infomation
     * @description set ID's workspace infomation
     * @returns true if setting infomation succeed, false if failed
     */
    static setWorkspaceInfo(workspaceId: string, data: TWorkspaceData | TWorkspaceCreateData | TWorkspaceUpdateData) {
        const defaultPath = this.getWorkspaceDataPath(workspaceId);

        if (!isExists(defaultPath)) {
            return false;
        }
        const workspacePath = `${defaultPath}/${workspaceFileName}`;

        return setJsonData(workspacePath, data);
    }

    /**
     *
     * @param workspaceId ID that you want to compare
     * @param workspaceName name that you want to compare
     * @description compare workspace name to ID's workspace name
     * @returns true if workspaceId's name is same to workspace name, false if different
     */
    static compareWorkspaceName(workspaceId: string, workspaceName?: string) {
        return (this.getWorkspaceInfo(workspaceId) as TWorkspaceData).name === workspaceName;
    }

    /**
     *
     * @param userId user ID that you want to know if he is a creator
     * @param workspaceId workspace ID to compare with userid to see if he is a creator.
     * @description check if user is a creator of workspace
     * @returns true if workspace's creator is userId, false if not
     */
    static isWorkspaceCreator(userId: string, workspaceId: string) {
        return (this.getWorkspaceInfo(workspaceId) as TWorkspaceData)?.creator === userId;
    }

    /**
     *
     * @param userId user ID that you want to know if he is participant of workspace
     * @param workspaceId workspace ID to see if userId is a participant of workerspace.
     * @description check if user is a participant of workspace
     * @returns true if user ID is a participant of workspace, false if not
     */
    static isWorkspaceParticipants(userId: string, workspaceId: string) {
        return this.getWorkspaceInfo(workspaceId)?.participants?.includes(userId);
    }

    /**
     *
     * @param userId user ID that you want to know if he has authority of this workspace
     * @param workspaceId workspace ID to see if user ID has authority of this workspace
     * @param participantIncluded check true if you want to allow authority to participant, check false if not
     * @description check if user has authority of this workspace
     * @returns true if user ID has authority of this workspace, false if not
     */
    static canEditWorkspace(userId: string, workspaceId: string, participantIncluded: boolean) {
        return this.isWorkspaceCreator(userId, workspaceId) || participantIncluded
            ? this.isWorkspaceParticipants(userId, workspaceId)
            : false;
    }

    /**
     *
     * @param userId user ID to get workspace ID
     * @param workspaceName workspace name to get workspace ID
     * @description get workspace ID from user ID, workspace name
     * @returns workspace ID that userId has authority and workspace's name is workspaceName
     */
    static getWorkspaceId(userId: string, workspaceName: string) {
        return fs.readdirSync(this.getWorkspaceDefaultPath()).find((workspaceId) => {
            const workspaceInfo = this.getWorkspaceInfo(workspaceId);
            return workspaceInfo ? this.canEditWorkspace(userId, workspaceId, true) && workspaceInfo.name === workspaceName : false;
        });
    }

    /**
     *
     * @param workspaceId workspace ID to be downloaded from git url
     * @param source object that contains git url
     * @description git clone from git url
     * @returns true if succeed, false if not
     */
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

    /**
     *
     * @param workspaceId workspace ID to be downloaded from zip file
     * @param source object that contains File ID and isExtract
     * @description move zip file to workspace and if isExtract is true, unzip zip file to workspace
     * @returns true if succeed to move zip file or unzip zip file, false if not
     */
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

    /**
     *
     * @param workspaceId workspace ID
     * @param source object that contains type
     * @description create empty workspace
     * @returns true if function has no error, false if not
     */
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
     * @returns {TReturnData } : code based on the result and message if function has error
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
    ): TReturnWorkspaceData {
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
                if (!fs.existsSync(UploadDirectoryPath)) {
                    fs.mkdirSync(UploadDirectoryPath, {
                        recursive: true,
                    });
                }
                const extension = DataUploadManager.UploadFileManager[thumbnail].originalname.split(".").pop();
                if (!handle(`${UploadDirectoryPath}/${thumbnail}`, `${UploadDirectoryPath}/${thumbnail}.${extension}`)) {
                    return { code: ResponseCode.internalError, message: "Failed to handle thumbnail image" };
                }
                thumbnail = `${thumbnail}.${extension}`;
                DataUploadManager.deleteUploadFileInfo(thumbnail);
            }
            const workspaceParticipants = participants ? [...participants, userId] : [userId];
            if (
                !this.setWorkspaceInfo(workspaceId, {
                    workspaceId: workspaceId,
                    name: name,
                    description: description,
                    thumbnail: thumbnail,
                    creator: userId,
                    participants: workspaceParticipants,
                    creation: getTime(getTime(), "YY-MM-DD"),
                })
            ) {
                return { code: ResponseCode.internalError, message: `Failed to create workspace` };
            }

            if (func?.[source.type](workspaceId, source) !== true) {
                return { code: ResponseCode.internalError, message: `Failed to create workspace with ${source.type}` };
            }
            DataDockerManager.create(userId, dockerInfo, { workspaceId, workspaceName: name, workspaceParticipants });
            return { code: ResponseCode.ok, workspaceId };
        } catch (err: any) {
            log.error(err.stack);
            return { code: ResponseCode.internalError, message: "Error occured" };
        }
    }

    /**
     *
     * @param userId user ID to find workspace
     * @param workspaceId workspace ID to find workspace
     * @param participantIncluded check true if you want to allow authority to participant, check false if not
     * @param workspaceInfo workspace infomation to update old workspace infomation
     * @param dockerInfo container infomation to update old container infomation
     * @description update workspace infomation
     * @returns {TReturnData } : code based on the result and message if function has error
     */
    static update(
        userId: string,
        workspaceId: string,
        participantIncluded: boolean,
        workspaceInfo: TWorkspaceUpdateData,
        dockerInfo: TDockerUpdateData
    ): TReturnData {
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
                if (
                    !handle(
                        `${UploadDirectoryPath}/${workspaceInfo.thumbnail}`,
                        `${UploadDirectoryPath}/${workspaceInfo.thumbnail}.${extension}`
                    )
                ) {
                    return { code: ResponseCode.internalError, message: "Failed to handle thumbnail image" };
                }
                if (workspaceData.thumbnail !== undefined) {
                    fs.unlinkSync(`${UploadDirectoryPath}/${workspaceData.thumbnail}`);
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

    /**
     *
     * @param userId user ID to delete workspace
     * @param workspaceId workspace ID to delete workspace
     * @description delete workspace
     * @returns {TReturnData } : code based on the result and message if function has error
     */
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

    /**
     *
     * @param userId user ID to export workspace
     * @param workspaceId workspace ID to export workspace
     * @returns true if you succeed to export workspace, false if not
     */
    static export(
        userId: string,
        { dockerOption, workspaceOption }: { dockerOption?: TDockerExportOption; workspaceOption: TWorkspaceExportOption }
    ) {
        if (dockerOption !== undefined) {
            if (!DataDockerManager.export(userId, dockerOption)) {
                return { code: ResponseCode.internalError, message: "Error occurred while exporting workspace" };
            }
            return { code: ResponseCode.ok, message: "Export container request confirmed" };
        }

        const workspaceId = workspaceOption.workspaceId;
        if (workspaceId === undefined) {
            return false;
        }

        const extensionList = ["zip", "tar", "7z", "tar.gz", "egg"];
        const extension = extensionList.includes(workspaceOption.extension)
            ? workspaceOption.extension
            : os.platform() === "win32"
            ? "zip"
            : "tar";

        if (!isExists(ExportDirectoryPath)) {
            fs.mkdirSync(ExportDirectoryPath, { recursive: true });
        }
        try {
            const downloadPath = `${ExportDirectoryPath}/${workspaceId}.${extension}`;
            if (isExists(downloadPath)) {
                fs.unlinkSync(downloadPath);
            }

            zip(this.getWorkspaceWorkPath(workspaceId), downloadPath).then(() => {
                DataAlarmManager.create(userId, {
                    type: "workspace",
                    location: `/api/download/${workspaceId}.${extension}`,
                    content: `Export workspace complete`,
                    checkAlarm: { [userId]: true },
                });
            });
        } catch (e: any) {
            log.error(e.stack);
            DataAlarmManager.create(userId, {
                type: "workspace",
                location: ``,
                content: `Failed to export workspace`,
                checkAlarm: { [userId]: true },
            });
            return { code: ResponseCode.internalError, message: "Error occurred while exporting workspace" };
        }
        return { code: ResponseCode.ok, message: "Export workspace request confirmed" };
    }
}

type TDockerExportOption = {
    containerId: string;
    imageName: string;
    tagName: string;
};
type TWorkspaceExportOption = {
    workspaceId: string;
    extension: string;
};
