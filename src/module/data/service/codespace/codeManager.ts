import { ResponseCode } from "../../../../constants/response";
import { TReturnData, WorkDirectoryPath } from "../../../../types/module/data/data.types";
import { TFile, TFileData, TReturnFileData } from "../../../../types/module/data/service/etc/file.types";
import { AutoMergeSystem, TReadyQueueItem, TUpdateContentItem } from "../../../merge";
import { getAllChildren, isExists, readCodesFromFile, writeCodeToFile } from "../etc/fileManager";
import DataWorkspaceManager from "../workspace/workspaceManager";
import path from "path";
import fs from "fs";
import log from "../../../log";

export default class DataCodeManager {
    static codeMergeManager: AutoMergeSystem;

    /**
     * @description start codespace's auto merge system
     */
    static run() {
        const codeDefaultPath = this.getCodePath();
        if (!isExists(codeDefaultPath)) {
            fs.mkdirSync(codeDefaultPath, { recursive: true });
        }
        this.codeMergeManager = new AutoMergeSystem(codeDefaultPath);
    }

    /**
     *
     * @description get code path
     * @returns code path
     */
    static getCodePath() {
        return DataWorkspaceManager.getWorkspaceDefaultPath();
    }

    static checkError(userId: string, workspaceId: string) {
        if (workspaceId === undefined) {
            return { code: ResponseCode.missingParameter, message: "Could not find workspace" };
        }
        if (!DataWorkspaceManager.canEditWorkspace(userId, workspaceId, true)) {
            return { code: ResponseCode.forbidden, message: "Could not edit workspace" };
        }
        return { code: ResponseCode.ok };
    }

    /**
     *
     * @param userId user ID to get code
     * @param workspaceId workspace ID to get code
     * @param filePath file path to get code
     * @description
     * @returns {TFileData} if you succeed to get code, error code and message if not
     */
    static get(userId: string, { workspaceId, filePath }: { workspaceId: string; filePath: string }) {
        const checkError = this.checkError(userId, workspaceId);
        if (checkError.code !== ResponseCode.ok) {
            return checkError;
        }
        const fileData: TFileData = {};
        const codeData = readCodesFromFile(DataWorkspaceManager.getWorkspaceWorkPath(workspaceId), filePath);
        if (codeData !== undefined) {
            fileData["filePath"] = filePath;
            fileData["fileContent"] = codeData;
        }
        return fileData;
    }

    /**
     *
     * @param userId user ID to save code to file
     * @param workspaceId workspace ID to save code to file
     * @param filePath file path to save code to file
     * @param code code content that save to file
     * @description save code to user workspace's file path
     * @returns {TReturnFileData } : code based on the result and message if function has error
     */
    static changeCode(userId: string, { workspaceId, filePath, code }: { workspaceId: string; filePath: string; code: string }): TReturnFileData {
        const checkError = this.checkError(userId, workspaceId);
        if (checkError.code !== ResponseCode.ok) {
            return checkError;
        }

        if (!writeCodeToFile(DataWorkspaceManager.getWorkspaceWorkPath(workspaceId), filePath, code)) {
            return { code: ResponseCode.internalError, message: "Failed to change code" };
        }
        return { code: ResponseCode.ok, path: filePath };
    }

    /**
     *
     * @param userId user ID to update code
     * @param workspaceId workspace ID to update code
     * @param updateContent content data that update code using auto merge system
     * @description update code using updateContent and auto merge system
     * @returns {TReturnFileData} : code based on the result and message if function has error
     */
    static updateCode(userId: string, { workspaceId, updateContent }: { workspaceId: string; updateContent: TReadyQueueItem }): TReturnFileData {
        const checkError = this.checkError(userId, workspaceId);
        if (checkError.code !== ResponseCode.ok) {
            return checkError;
        }

        if (updateContent.path === undefined || updateContent.content === undefined) {
            return { code: ResponseCode.missingParameter, message: "Invaild update content" };
        }

        try {
            const fullPath = path.join(DataWorkspaceManager.getWorkspaceWorkPath(workspaceId), updateContent.path);
            this.codeMergeManager.update(fullPath, updateContent.content);
            return { code: ResponseCode.ok, path: updateContent.path };
        } catch (e) {
            return { code: ResponseCode.internalError, message: "Failed to merge code" };
        }
    }

    /**
     *
     * @param userId user ID to get workspace path
     * @param workspaceId workspace ID to get workspace path
     * @param oldPath path of the current file of directory
     * @param newPath file of directory path that you want to move
     * @description move file or directory from old path to new path
     * @returns {TReturnFileData } : code based on the result and message if function has error
     */
    static moveFileOrDir(userId: string, { workspaceId, oldPath, newPath }: { workspaceId: string; oldPath: string; newPath: string }): TReturnFileData {
        const checkError = this.checkError(userId, workspaceId);
        if (checkError.code !== ResponseCode.ok) {
            return checkError;
        }

        const fullOldPath = path.join(DataWorkspaceManager.getWorkspaceWorkPath(workspaceId), oldPath);
        const fullNewPath = path.join(DataWorkspaceManager.getWorkspaceWorkPath(workspaceId), newPath);
        if (!isExists(fullOldPath)) {
            return { code: ResponseCode.internalError, message: "Could not find path" };
        }
        try {
            fs.renameSync(fullOldPath, fullNewPath);
        } catch (e: any) {
            log.error(e.stack);
            return { code: ResponseCode.internalError, message: "Error occured move file or dir" };
        }
        return { code: ResponseCode.ok, path: newPath };
    }

    /**
     *
     * @param userId user ID to get workspace path
     * @param workspaceId workspace ID to get workspace path
     * @param deletePath file or directory path to remove from workspace
     * @param recursive check true if you want to remove directory recursive, false if not
     * @description remove file or directory from workspace
     * @returns {TReturnFileData } : code based on the result and message if function has error
     */
    static deleteFileOrDir(userId: string, { workspaceId, deletePath, recursive }: { workspaceId: string; deletePath: string; recursive?: boolean }): TReturnFileData {
        const checkError = this.checkError(userId, workspaceId);
        if (checkError.code !== ResponseCode.ok) {
            return checkError;
        }

        try {
            const fullPath = path.join(DataWorkspaceManager.getWorkspaceWorkPath(workspaceId), deletePath);
            if (fs.statSync(fullPath).isDirectory()) {
                fs.rmdirSync(fullPath, { recursive: recursive });
            } else if (fs.statSync(fullPath).isFile()) {
                fs.unlinkSync(fullPath);
            }
        } catch (e: any) {
            log.error(e.stack);
            return { code: ResponseCode.internalError, message: "Error occurred" };
        }
        return { code: ResponseCode.ok, path: deletePath };
    }

    /**
     *
     * @param userId user ID to get workspace path
     * @param workspaceId workspace ID to get workspace path
     * @param filePath file path to create file
     * @description create file at file path of workspace
     * @returns {TReturnFileData } : code based on the result and message if function has error
     */
    static createFile(userId: string, { workspaceId, filePath }: { workspaceId: string; filePath: string }): TReturnFileData {
        const checkError = this.checkError(userId, workspaceId);
        if (checkError.code !== ResponseCode.ok) {
            return checkError;
        }

        try {
            const fullPath = path.join(DataWorkspaceManager.getWorkspaceWorkPath(workspaceId), filePath);
            fs.openSync(fullPath, "w");
        } catch (e: any) {
            log.error(e.stack);
            return { code: ResponseCode.internalError, message: "Failed to create file" };
        }
        return { code: ResponseCode.ok, path: filePath };
    }

    /**
     *
     * @param userId user ID to get workspace path
     * @param workspaceId workspace ID to get workspace path
     * @param dirPath directory path to create file
     * @description create directory at directory path of workspace
     * @returns {TReturnFileData } : code based on the result and message if function has error
     */
    static createDir(userId: string, { workspaceId, dirPath }: { workspaceId: string; dirPath: string }): TReturnFileData {
        const checkError = this.checkError(userId, workspaceId);
        if (checkError.code !== ResponseCode.ok) {
            return checkError;
        }

        try {
            const fullPath = path.join(DataWorkspaceManager.getWorkspaceWorkPath(workspaceId), dirPath);
            fs.mkdirSync(fullPath, { recursive: true });
        } catch (e: any) {
            log.error(e.stack);
            return { code: ResponseCode.internalError, message: "Failed to create directory" };
        }
        return { code: ResponseCode.ok, path: dirPath };
    }

    /**
     *
     * @param userId user ID to get workspace path
     * @param workspaceId workspace ID to get workspace path
     * @description get all directory and file path of workspace
     * @returns {TReturnFileData | TFile } : code based on the result and message if function has error. if succeed, get all path of workspace
     */
    static getAllFilePath(userId: string, workspaceId: string): TFile | TReturnData {
        const checkError = this.checkError(userId, workspaceId);
        if (checkError.code !== ResponseCode.ok) {
            return checkError;
        }

        const workspacePath = DataWorkspaceManager.getWorkspaceWorkPath(workspaceId);
        return getAllChildren(workspaceId, workspacePath, "/");
    }
}
