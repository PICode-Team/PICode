import log from "../../module/log";
import { UploadDirectoryPath, WorkDirectoryPath, DataDirectoryPath, StaticDirectoryPath } from "../../types/module/data/data.types";
import { TprojectCreateData, TProjectData, TProjectUpdateData } from "../../types/module/data/project.type";
import { setJsonData, getJsonData, isExists, removeData, handle, searchProjectFiles, readCodesFromFile, writeCodeToFile, getAllChildren } from "./fileManager";
import DataUploadManager from "./uploadManager";
import fs from "fs";
import simpleGit from "simple-git";
import { zip } from "zip-a-folder";
import { TFileData, TUploadFileLanguageToSize } from "../../types/module/data/file.types";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { TDockerCreateData, TDockerUpdateData } from "../../types/module/data/docker.types";
import DataDockerManager from "./dockerManager";
import { ResponseCode } from "../../constants/response";

export default class DataProjectManager {
    static isExists(projectId: string, projectPath: (projectId: string, type?: undefined) => string) {
        return isExists(projectPath(projectId));
    }

    static getProjectDefaultPath() {
        return `${DataDirectoryPath}/project`;
    }

    static getProjectWorkPath(projectId: string) {
        return `${WorkDirectoryPath}/project/${projectId}`;
    }

    static getProjectDataPath(projectId: string, type: undefined | "projectInfo.json" = undefined) {
        return type !== undefined ? `${DataDirectoryPath}/project/${projectId}/${type}` : `${DataDirectoryPath}/project/${projectId}`;
    }

    static getProjectInfo(projectId: string) {
        if (!this.isExists(projectId, this.getProjectDataPath)) {
            return undefined;
        }

        return getJsonData(this.getProjectDataPath(projectId, "projectInfo.json")) as TProjectData;
    }

    static setProjectInfo(projectId: string, data: TProjectData | TprojectCreateData | TProjectUpdateData) {
        if (!this.isExists(projectId, this.getProjectDataPath)) {
            return undefined;
        }

        return setJsonData(this.getProjectDataPath(projectId, "projectInfo.json"), data);
    }

    static compareProjectName(projectId: string, projectName?: string) {
        return (this.getProjectInfo(projectId) as TProjectData).projectName === projectName;
    }

    static isProjectCreator(userId: string, projectId: string) {
        return (this.getProjectInfo(projectId) as TProjectData).projectCreator === userId;
    }

    static isProjectParticipants(userId: string, projectId: string) {
        return (this.getProjectInfo(projectId) as TProjectData).projectParticipants?.includes(userId);
    }

    static canEditProject(userId: string, projectId: string, participantIncluded: boolean) {
        return this.isProjectCreator(userId, projectId) || participantIncluded ? this.isProjectParticipants(userId, projectId) : false;
    }

    static getProjectId(userId: string, projectName: string) {
        return fs.readdirSync(this.getProjectDefaultPath()).find((projectId) => {
            const projectInfo = this.getProjectInfo(projectId);
            return projectInfo ? (projectInfo.projectCreator === userId || projectInfo.projectParticipants?.includes(userId)) && projectInfo.projectName === projectName : false;
        });
    }

    static isValidAuth(userId: string, projectName: string, participantIncluded: boolean) {
        const projectId = this.getProjectId(userId, projectName);
        if (projectId === undefined) {
            return false;
        }
        if (!this.canEditProject(userId, projectId, participantIncluded)) {
            return false;
        }
        return true;
    }

    static gitCloneFromURL(
        projectId: string,
        source: {
            gitUrl?: string;
        }
    ) {
        const clonePath = DataProjectManager.getProjectWorkPath(projectId);
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
                    const projectInfo = DataProjectManager.getProjectInfo(projectId);
                    if (projectInfo === undefined) {
                        throw new Error(`could not find projectInfo`);
                    }
                    searchProjectFiles(clonePath, { fileToSize: fileToSize }),
                        DataProjectManager.setProjectInfo(projectId, {
                            ...projectInfo,
                            projectLanguage: fileToSize,
                        } as TProjectUpdateData);
                    log.info(`git clone complete gitUrl: ${source.gitUrl}`);
                })
                .catch((e) => {
                    log.error(e.stack);
                });
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
        const fileName = DataUploadManager.UploadFileManager[uploadFileId].originalname;
        const newPath = DataProjectManager.getProjectWorkPath(projectId);
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
                    searchProjectFiles(newPath, { fileToSize: fileToSize });
                    DataProjectManager.setProjectInfo(projectId, {
                        ...DataProjectManager.getProjectInfo(projectId),
                        projectLanguage: fileToSize,
                    } as TProjectUpdateData);
                    DataUploadManager.deleteUploadFileInfo(uploadFileId);
                }
            },
        })
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

    static get(userId: string, projectName?: string) {
        DataUploadManager.loadUploadFileInfo();
        if (!fs.existsSync(this.getProjectDefaultPath())) {
            fs.mkdirSync(this.getProjectDefaultPath(), { recursive: true });
        }

        return fs
            .readdirSync(this.getProjectDefaultPath())
            .filter((projectUUID) => {
                return (
                    (this.isProjectCreator(userId, projectUUID) || this.isProjectParticipants(userId, projectUUID)) &&
                    (this.compareProjectName(projectUUID, projectName) || projectName === undefined || projectName === "")
                );
            })
            .map((projectId) => {
                return { ...(this.getProjectInfo(projectId) as TProjectData), ...DataDockerManager.getDockerInfo(projectId) };
            });
    }

    static create(
        userId: string,
        { projectName, projectDescription, projectThumbnail, projectParticipants }: TprojectCreateData,
        dockerInfo: TDockerCreateData,
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

        if (this.getProjectId(userId, projectName) !== undefined) {
            return false;
        }
        const func: {
            [key in string]: (projectId: string, source: any) => boolean;
        } = {
            gitUrl: this.gitCloneFromURL,
            upload: this.createProjectFromFile,
            nothing: this.createEmptyProject,
        };
        try {
            DataUploadManager.loadUploadFileInfo();
            const projectId = uuidv4();

            if (!func[source.type](projectId, source)) {
                return false;
            }

            fs.mkdirSync(this.getProjectDataPath(projectId), { recursive: true });

            if (projectThumbnail !== undefined) {
                if (!fs.existsSync(StaticDirectoryPath)) {
                    fs.mkdirSync(StaticDirectoryPath, {
                        recursive: true,
                    });
                }
                const extension = DataUploadManager.UploadFileManager[projectThumbnail].originalname.split(".").pop();
                if (!handle(`${UploadDirectoryPath}/${projectThumbnail}`, `${StaticDirectoryPath}/${projectThumbnail}.${extension}`)) {
                    return false;
                }
                projectThumbnail = `${projectThumbnail}.${extension}`;
                DataUploadManager.deleteUploadFileInfo(projectThumbnail);
            }
            const participants = projectParticipants ? [...projectParticipants, userId] : [userId];
            this.setProjectInfo(projectId, {
                projectId: projectId,
                projectName: projectName,
                projectDescription: projectDescription,
                projectThumbnail: projectThumbnail,
                projectCreator: userId,
                projectParticipants: participants,
            });
            DataDockerManager.create(userId, dockerInfo, { projectId, projectName, projectParticipants: participants });
        } catch (err) {
            log.error(err.stack);
            return false;
        }
        return true;
    }

    static update(userId: string, projectName: string, participantIncluded: boolean, projectInfo: TProjectUpdateData, dockerInfo: TDockerUpdateData): boolean {
        DataUploadManager.loadUploadFileInfo();
        const projectId = this.getProjectId(userId, projectName);
        if (projectId === undefined) {
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
            if (projectInfo.projectThumbnail !== undefined && path.parse(projectData.projectThumbnail as string).name !== projectInfo.projectThumbnail) {
                const extension = DataUploadManager.UploadFileManager[projectInfo.projectThumbnail].originalname.split(".").pop();
                if (!handle(`${UploadDirectoryPath}/${projectInfo.projectThumbnail}`, `${StaticDirectoryPath}/${projectInfo.projectThumbnail}.${extension}`)) {
                    return false;
                }
                if (projectData.projectThumbnail !== undefined) {
                    fs.unlinkSync(`${StaticDirectoryPath}/${projectData.projectThumbnail}`);
                }
                projectData.projectThumbnail = `${projectInfo.projectThumbnail}.${extension}`;
                DataUploadManager.deleteUploadFileInfo(projectInfo.projectThumbnail);
            }
            if (
                !this.setProjectInfo(projectId, {
                    projectId: projectData.projectId,
                    projectName: projectInfo.projectName ?? projectData.projectName,
                    projectDescription: projectInfo.projectDescription ?? projectData.projectDescription,
                    projectThumbnail: projectInfo.projectThumbnail ?? projectData.projectThumbnail,
                    projectLanguage: projectData.projectLanguage,
                    projectCreator: projectData.projectCreator,
                    projectParticipants: projectInfo.projectParticipants ?? projectData.projectParticipants,
                })
            ) {
                return false;
            }
            DataDockerManager.update(userId, projectName, dockerInfo);
        } catch (e) {
            log.error(e.stack);
            return false;
        }
        return true;
    }

    static delete(userId: string, projectName: string): boolean {
        const projectId = this.getProjectId(userId, projectName);
        if (projectId === undefined) {
            return false;
        }
        if (!this.canEditProject(userId, projectId, false)) {
            return false;
        }
        if (!DataDockerManager.delete(userId, projectName)) {
            return false;
        }
        if (!this.isExists(projectId, this.getProjectWorkPath) || !removeData(this.getProjectWorkPath(projectId))) {
            return false;
        }
        return true;
    }

    static export(userId: string, projectName: string) {
        const projectId = this.getProjectId(userId, projectName);
        if (projectId === undefined) {
            return false;
        }
        try {
            zip(this.getProjectWorkPath(projectId), `${this.getProjectWorkPath(projectId)}/${projectName}.zip`);
        } catch (e) {
            log.error(e.stack);
            return false;
        }
        return true;
    }

    static getCodesFromProject(userId: string, { projectName, filePath }: { projectName: string; filePath: string }) {
        const projectId = this.getProjectId(userId, projectName);
        if (projectId === undefined) {
            return { message: "could not find project" };
        }
        if (!this.canEditProject(userId, projectId, true)) {
            return { message: "could not edit project" };
        }
        const fileData: TFileData = {};
        const codeData = readCodesFromFile(this.getProjectWorkPath(projectId), filePath);
        if (codeData !== undefined) {
            fileData["filePath"] = filePath;
            fileData["fileContent"] = codeData;
        }
        return fileData;
    }

    static changeProjectCode(userId: string, { projectName, filePath, code }: { projectName: string; filePath: string; code: string }) {
        const projectId = this.getProjectId(userId, projectName);
        if (projectId === undefined) {
            return { code: ResponseCode.missingParameter };
        }
        if (!this.canEditProject(userId, projectId, true)) {
            return { code: ResponseCode.invaildRequest };
        }

        if (!writeCodeToFile(this.getProjectWorkPath(projectId), filePath, code)) {
            return { code: ResponseCode.internalError };
        }
        return { code: ResponseCode.ok, path: filePath };
    }

    static moveProjectFileOrDir(userId: string, { projectName, oldPath, newPath }: { projectName: string; oldPath: string; newPath: string }) {
        const projectId = this.getProjectId(userId, projectName);
        if (projectId === undefined) {
            return { code: ResponseCode.missingParameter };
        }
        if (!this.canEditProject(userId, projectId, true)) {
            return { code: ResponseCode.invaildRequest };
        }
        const fullOldPath = path.join(this.getProjectWorkPath(projectId), oldPath);
        const fullNewPath = path.join(this.getProjectWorkPath(projectId), newPath);
        if (!isExists(fullOldPath)) {
            return { code: ResponseCode.internalError };
        }
        try {
            fs.renameSync(fullOldPath, fullNewPath);
        } catch (e) {
            log.error(e.stack);
            return { code: ResponseCode.internalError };
        }
        return { code: ResponseCode.ok, path: newPath };
    }

    static deleteFileOrDir(userId: string, { projectName, deletePath, recursive }: { projectName: string; deletePath: string; recursive?: boolean }) {
        const projectId = this.getProjectId(userId, projectName);
        if (projectId === undefined) {
            return { code: ResponseCode.missingParameter };
        }
        if (!this.canEditProject(userId, projectId, true)) {
            return { code: ResponseCode.invaildRequest };
        }
        try {
            const fullPath = path.join(this.getProjectWorkPath(projectId), deletePath);
            if (fs.statSync(fullPath).isDirectory()) {
                fs.rmdirSync(fullPath, { recursive: recursive });
            } else if (fs.statSync(fullPath).isFile()) {
                fs.unlinkSync(fullPath);
            }
        } catch (e) {
            log.error(e.stack);
            return { code: ResponseCode.internalError };
        }
        return { code: ResponseCode.ok, path: deletePath };
    }
    static createProjectFile(userId: string, { projectName, filePath }: { projectName: string; filePath: string }) {
        const projectId = this.getProjectId(userId, projectName);
        if (projectId === undefined) {
            return { code: ResponseCode.missingParameter };
        }
        if (!this.canEditProject(userId, projectId, true)) {
            return { code: ResponseCode.invaildRequest };
        }
        try {
            const fullPath = path.join(this.getProjectWorkPath(projectId), filePath);
            fs.openSync(fullPath, "w");
        } catch (e) {
            log.error(e.stack);
            return { code: ResponseCode.internalError };
        }
        return { code: ResponseCode.ok, path: filePath };
    }
    static createProjectDir(userId: string, { projectName, dirPath }: { projectName: string; dirPath: string }) {
        const projectId = this.getProjectId(userId, projectName);
        if (projectId === undefined) {
            return { code: ResponseCode.missingParameter };
        }
        if (!this.canEditProject(userId, projectId, true)) {
            return { code: ResponseCode.invaildRequest };
        }
        try {
            const fullPath = path.join(this.getProjectWorkPath(projectId), dirPath);
            fs.mkdirSync(fullPath, { recursive: true });
        } catch (e) {
            log.error(e.stack);
            return { code: ResponseCode.internalError };
        }
        return { code: ResponseCode.ok, path: dirPath };
    }

    static getAllProjectPath(userId: string, projectName: string) {
        const projectId = this.getProjectId(userId, projectName);
        if (projectId === undefined) {
            return { code: ResponseCode.missingParameter };
        }
        if (!this.canEditProject(userId, projectId, true)) {
            return { code: ResponseCode.invaildRequest };
        }
        const projectPath = DataProjectManager.getProjectWorkPath(projectId);
        return getAllChildren(projectId, projectPath, "/");
    }
}
