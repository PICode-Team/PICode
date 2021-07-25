import log from "../../module/log";
import { UploadDirectoryPath, WorkDirectoryPath, DataDirectoryPath } from "../../types/module/data/data.types";
import { TprojectCreateData, TProjectData, TProjectUpdateData } from "../../types/module/data/project.type";
import { setJsonData, getJsonData, isExists, removeData, handle, UploadFileManager, searchProjectFiles, readCodesFromFile, writeCodeToFile, getAllChildren } from "./fileManager";
import fs from "fs";
import * as child from "child_process";
import { zip } from "zip-a-folder";
import {
    TFileData,
    TUploadFileLanguageToSize,
} from "../../types/module/data/file.types";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export default class DataProjectManager {
    static isExists(projectId: string, projectPath: Function) {
        return isExists(projectPath(projectId));
    }

    static getProjectDefaultPath() {
        return `${DataDirectoryPath}/project`;
    }

    static getProjectWorkPath(projectId: string) {
        return `${WorkDirectoryPath}/project/${projectId}/`;
    }

    static getProjectDataPath(
        projectId: string,
        type: "" | "projectInfo.json" = ""
    ) {
        return `${DataDirectoryPath}/project/${projectId}/${type}`;
    }

    static getProjectInfo(projectId: string) {
        if (!this.isExists(projectId, this.getProjectDataPath)) {
            return undefined;
        }

        return getJsonData(
            this.getProjectDataPath(projectId, "projectInfo.json")
        ) as TProjectData;
    }

    static setProjectInfo(
        projectId: string,
        data: TProjectData | TprojectCreateData | TProjectUpdateData
    ) {
        if (!this.isExists(projectId, this.getProjectDataPath)) {
            return undefined;
        }

        return setJsonData(
            this.getProjectDataPath(projectId, "projectInfo.json"),
            data
        );
    }

    static compareProjectName(projectId: string, projectName?: string) {
        return (
            (this.getProjectInfo(projectId) as TProjectData).projectName ===
            projectName
        );
    }

    static isProjectCreator(userId: string, projectId: string) {
        return (
            (this.getProjectInfo(projectId) as TProjectData).projectCreator ===
            userId
        );
    }

    static isProjectParticipants(userId: string, projectId: string) {
        return (
            this.getProjectInfo(projectId) as TProjectData
        ).projectParticipants?.includes(userId);
    }

    static canEditProject(
        userId: string,
        projectId: string,
        participantIncluded: boolean
    ) {
        return this.isProjectCreator(userId, projectId) || participantIncluded
            ? this.isProjectParticipants(userId, projectId)
            : false;
    }

    static getProjectId(userId: string, projectName: string) {
        const projectId = fs
            .readdirSync(this.getProjectDefaultPath())
            .filter((projectId) => {
                const projectInfo = this.getProjectInfo(
                    projectId
                ) as TProjectData;
                return (
                    (projectInfo.projectCreator === userId ||
                        projectInfo.projectParticipants?.includes(userId)) &&
                    projectInfo.projectName === projectName
                );
            });
        if (projectId.length > 1) {
            return projectId;
        } else if (projectId.length === 1) {
            return projectId[0];
        } else {
            return undefined;
        }
    }

    static gitCloneFromURL(projectId: string, gitUrl: any) {
        const clonePath = this.getProjectWorkPath(projectId);

        if (!fs.existsSync(clonePath)) {
            fs.mkdirSync(clonePath, { recursive: true });
        }
        try {
            child.exec(
                `git clone ${gitUrl}`,
                {
                    cwd: clonePath,
                    env: process.env,
                },
                (error, _stdout, stderr) => {
                    error ? log.error(error) : log.info(stderr);
                }
            );
        } catch (e) {
            log.error(e.stack);
            return false;
        }
        return true;
    }

    static createProjectFromFile(
        projectId: string,
        source: {
            upload: {
                uploadFileId: string;
                isExtract?: boolean;
            };
        }
    ) {
        const uploadFileId = source.upload.uploadFileId;
        const isExtract = source.upload.isExtract;
        const fileName = UploadFileManager[uploadFileId].originalname;
        const newPath = DataProjectManager.getProjectWorkPath(projectId);
        if (!fs.existsSync(newPath)) {
            fs.mkdirSync(newPath, { recursive: true });
        }
        return handle(
            `${UploadDirectoryPath}/${uploadFileId}`,
            `${newPath}/${fileName}`,
            {
                isExtract: isExtract,
                extractPath: isExtract ? newPath : undefined,
                extractCallback: (err) => {
                    if (err) {
                        log.error(err.stack);
                    } else {
                        fs.unlinkSync(`${newPath}/${fileName}`);
                        const fileToSize: TUploadFileLanguageToSize = {};
                        searchProjectFiles(newPath, { fileToSize: fileToSize });
                        DataProjectManager.setProjectInfo(projectId, {
                            ...DataProjectManager.getProjectInfo(projectId),
                            projectLanguage: fileToSize,
                        } as TProjectUpdateData);
                        delete UploadFileManager[uploadFileId];
                    }
                },
            }
        )
            ? true
            : false;
    }

    static createEmptyProject(projectId: string, source: any) {
        if (source.type !== "nothing") {
            return false;
        }
        if (!fs.existsSync(DataProjectManager.getProjectWorkPath(projectId))) {
            fs.mkdirSync(DataProjectManager.getProjectWorkPath(projectId), {
                recursive: true,
            });
        }
        return true;
    }

    static get(userId: string, projectName?: string): TProjectData[] {
        if (!fs.existsSync(this.getProjectDefaultPath())) {
            fs.mkdirSync(this.getProjectDefaultPath(), { recursive: true });
        }

        return fs
            .readdirSync(this.getProjectDefaultPath())
            .filter((projectUUID) => {
                return (
                    (this.isProjectCreator(userId, projectUUID) ||
                        this.isProjectParticipants(userId, projectUUID)) &&
                    (this.compareProjectName(projectUUID, projectName) ||
                        projectName === undefined ||
                        projectName === "")
                );
            })
            .map((projectId) => {
                return this.getProjectInfo(projectId) as TProjectData;
            });
    }

    static create(
        userId: string,
        {
            projectName,
            projectDescription,
            projectThumbnail,
            projectParticipants,
        }: TprojectCreateData,
        source: {
            type: "gitUrl" | "upload" | "nothing";
            gitUrl?: string;
            upload?: {
                uploadFileId: string;
                isExtract?: boolean;
            };
        }
    ) {
        if (!fs.existsSync(this.getProjectDefaultPath())) {
            fs.mkdirSync(this.getProjectDefaultPath(), { recursive: true });
        }

        if (typeof this.getProjectId(userId, projectName) !== "undefined") {
            return false;
        }

        try {
            const projectId = uuidv4();
            const func: {
                [key in string]: (projectId: string, source: any) => boolean;
            } = {
                gitUrl: this.gitCloneFromURL,
                upload: this.createProjectFromFile,
                nothing: this.createEmptyProject,
            };
            if (!func[source.type](projectId, source)) {
                return false;
            }

            if (!fs.existsSync(this.getProjectDataPath(projectId))) {
                fs.mkdirSync(this.getProjectDataPath(projectId), {
                    recursive: true,
                });
            }

            if (projectThumbnail !== undefined) {
                if (
                    !handle(
                        `${UploadDirectoryPath}/${projectThumbnail}`,
                        `${this.getProjectWorkPath(
                            projectId
                        )}${projectThumbnail}`
                    )
                ) {
                    return false;
                }

                //delete UploadFileManager[projectThumbnail];
            }

            this.setProjectInfo(projectId, {
                projectId: projectId,
                projectName: projectName,
                projectDescription: projectDescription,
                projectThumbnail: projectThumbnail,
                projectCreator: userId,
                projectParticipants: projectParticipants
                    ? [...projectParticipants, userId]
                    : [userId],
            });
        } catch (err) {
            log.error(err.stack);
            return false;
        }
        return true;
    }

    static update(
        userId: string,
        projectName: string,
        participantIncluded: boolean,
        projectInfo: TProjectUpdateData
    ): boolean {
        const projectId = this.getProjectId(userId, projectName);
        if (typeof projectId !== "string") {
            return false;
        }
        try {
            if (!this.canEditProject(userId, projectId, participantIncluded)) {
                return false;
            }
            const projectData = this.getProjectInfo(projectId);
            if (projectData === undefined) {
                return false;
            }
            //projectParticipants가 있는지,없는지, 있다면 creator인 userId가 포함돼있는지, 아닌지
            if (
                !this.setProjectInfo(projectId, {
                    projectId: projectData.projectId,
                    projectName:
                        projectInfo.projectName ?? projectData.projectName,
                    projectDescription:
                        projectInfo.projectDescription ??
                        projectData.projectDescription,
                    projectThumbnail:
                        projectInfo.projectThumbnail ??
                        projectData.projectThumbnail,
                    projectLanguage: projectData.projectLanguage,
                    projectParticipants:
                        projectInfo.projectParticipants ??
                        projectData.projectParticipants,
                })
            ) {
                return false;
            }
        } catch (e) {
            log.error(e.stack);
            return false;
        }
        return true;
    }

    static delete(userId: string, projectName: string): boolean {
        const projectId = this.getProjectId(userId, projectName);
        if (typeof projectId !== "string") {
            return false;
        }

        if (!this.canEditProject(userId, projectId, false)) {
            return false;
        }
        if (!this.isExists(projectId, this.getProjectWorkPath)) {
            return false;
        }
        if (!removeData(this.getProjectWorkPath(projectId))) {
            return false;
        }
        if (!this.isExists(projectId, this.getProjectDataPath)) {
            return false;
        }
        if (!removeData(this.getProjectDataPath(projectId))) {
            return false;
        }
        return true;
    }

    static export(userId: string, projectName: string) {
        const projectId = this.getProjectId(userId, projectName);
        if (typeof projectId !== "string") {
            return false;
        }
        try {
            zip(
                this.getProjectWorkPath(projectId),
                `${this.getProjectWorkPath(projectId)}/${projectName}.zip`
            );
        } catch (e) {
            log.error(e.stack);
            return false;
        }
        return true;
    }

    static getCodesFromProject(
        userId: string,
        { projectName, filePath }: { projectName: string; filePath: string }
    ) {
        const projectId = this.getProjectId(userId, projectName);
        if (typeof projectId !== "string") {
            return { message: "could not find project" };
        }
        if (!this.canEditProject(userId, projectId, true)) {
            return { message: "could not edit project" };
        }
        const fileData: TFileData = {};
        const codeData = readCodesFromFile(
            this.getProjectWorkPath(projectId),
            filePath
        );
        if (codeData !== undefined) {
            fileData["filePath"] = filePath;
            fileData["fileContent"] = codeData;
        }
        return fileData;
    }

    static changeProjectCode(
        userId: string,
        {
            projectName,
            filePath,
            code,
        }: { projectName: string; filePath: string; code: string }
    ) {
        const projectId = this.getProjectId(userId, projectName);
        if (typeof projectId !== "string") {
            return { message: "could not find project" };
        }
        if (!this.canEditProject(userId, projectId, true)) {
            return { message: "could not edit project" };
        }

        if (
            !writeCodeToFile(this.getProjectWorkPath(projectId), filePath, code)
        ) {
            return { message: "file write error" };
        }
        return { message: "file write complete" };
    }

    static moveProjectFileOrDir(
        userId: string,
        {
            projectName,
            oldPath,
            newPath,
        }: { projectName: string; oldPath: string; newPath: string }
    ) {
        const projectId = this.getProjectId(userId, projectName);
        if (typeof projectId !== "string") {
            return { message: "could not find project" };
        }
        if (!this.canEditProject(userId, projectId, true)) {
            return { message: "could not change file or dir" };
        }
        const fullOldPath = path.join(
            this.getProjectWorkPath(projectId),
            oldPath
        );
        const fullNewPath = path.join(
            this.getProjectWorkPath(projectId),
            newPath
        );
        if (!isExists(fullOldPath)) {
            return { message: "could not find path" };
        }
        try {
            fs.renameSync(fullOldPath, fullNewPath);
        } catch (e) {
            log.error(e.stack);
            return { message: "fail to move file or dir" };
        }
        return { message: "move complete" };
    }

    static deleteFileOrDir(
        userId: string,
        {
            projectName,
            deletePath,
            recursive,
        }: { projectName: string; deletePath: string; recursive?: boolean }
    ) {
        const projectId = this.getProjectId(userId, projectName);
        if (typeof projectId !== "string") {
            return { message: "could not find project" };
        }
        if (!this.canEditProject(userId, projectId, true)) {
            return { message: "could not change file or dir" };
        }
        try {
            const fullPath = path.join(
                this.getProjectWorkPath(projectId),
                deletePath
            );
            if (fs.statSync(fullPath).isDirectory()) {
                fs.rmdirSync(fullPath, { recursive: recursive });
            } else if (fs.statSync(fullPath).isFile()) {
                fs.unlinkSync(fullPath);
            }
        } catch (e) {
            log.error(e.stack);
            return { message: "fail to delete file or dir" };
        }
        return { message: "delete complete" };
    }
    static createProjectFile(
        userId: string,
        { projectName, filePath }: { projectName: string; filePath: string }
    ) {
        const projectId = this.getProjectId(userId, projectName);
        if (typeof projectId !== "string") {
            return { message: "could not find project" };
        }
        if (!this.canEditProject(userId, projectId, true)) {
            return { message: "could not create file" };
        }
        try {
            const fullPath = path.join(
                this.getProjectWorkPath(projectId),
                filePath
            );
            fs.openSync(fullPath, "w");
        } catch (e) {
            log.error(e.stack);
            return { message: "fail to create file" };
        }
        return { message: "create file complete" };
    }
    static createProjectDir(
        userId: string,
        { projectName, dirPath }: { projectName: string; dirPath: string }
    ) {
        const projectId = this.getProjectId(userId, projectName);
        if (typeof projectId !== "string") {
            return { message: "could not find project" };
        }
        if (!this.canEditProject(userId, projectId, true)) {
            return { message: "could not create dir" };
        }
        try {
            const fullPath = path.join(
                this.getProjectWorkPath(projectId),
                dirPath
            );
            fs.mkdirSync(fullPath, { recursive: true });
        } catch (e) {
            log.error(e.stack);
            return { message: "fail to create dir" };
        }
        return { message: "create dir complete" };
    }

    static getAllProjectPath(userId: string, projectName: string) {
        const projectId = this.getProjectId(userId, projectName);
        if (typeof projectId !== "string") {
            return { message: "could not find project" };
        }
        if (!this.canEditProject(userId, projectId, true)) {
            return { message: "could not create dir" };
        }
        const projectPath = DataProjectManager.getProjectWorkPath(projectId);
        return getAllChildren(projectPath, "");
    }
}
