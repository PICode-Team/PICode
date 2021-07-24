import log from "../../module/log";
import {
    UploadDirectoryPath,
    WorkDirectoryPath,
    DataDirectoryPath,
} from "../../types/module/data/data.types";
import {
    TprojectCreateData,
    TProjectData,
    TProjectUpdateData,
} from "../../types/module/data/project.type";
import {
    setJsonData,
    getJsonData,
    isExists,
    removeData,
    handle,
    UploadFileManager,
    searchProjectFiles,
    readCodesFromFile,
} from "./fileManager";
import fs from "fs";
import * as child from "child_process";
import { zip } from "zip-a-folder";
import {
    TFileData,
    TUploadFileLanguageToSize,
} from "../../types/module/data/file.types";

export default class DataProjectManager {
    static isExists(
        userId: string,
        projectName: string,
        projectPath: Function
    ) {
        return isExists(projectPath(userId, projectName));
    }

    static getProjectDefaultPath() {
        return `${DataDirectoryPath}/project`;
    }

    static getProjectWorkPath(userId: string, projectName: string) {
        return `${WorkDirectoryPath}/project/${userId}+${projectName}/`;
    }

    static getProjectDataPath(
        userId: string,
        projectName: string,
        type: "" | "projectInfo.json" = ""
    ) {
        return `${DataDirectoryPath}/project/${userId}+${projectName}/${type}`;
    }

    static getProjectInfo(userId: string, projectName: string) {
        if (!this.isExists(userId, projectName, this.getProjectDataPath)) {
            return undefined;
        }

        return getJsonData(
            this.getProjectDataPath(userId, projectName, "projectInfo.json")
        ) as TProjectData;
    }

    static setProjectInfo(
        userId: string,
        projectName: string,
        data: TProjectData | TprojectCreateData | TProjectUpdateData
    ) {
        if (!this.isExists(userId, projectName, this.getProjectDataPath)) {
            return undefined;
        }

        if (data.projectName !== undefined) {
            fs.renameSync(
                this.getProjectDataPath(userId, projectName),
                this.getProjectDataPath(userId, data.projectName)
            );
        }

        return setJsonData(
            this.getProjectDataPath(
                userId,
                data.projectName ?? projectName,
                "projectInfo.json"
            ),
            data
        );
    }

    static getUserIdFromProjectName(projectName?: string) {
        return fs
            .readdirSync(this.getProjectDefaultPath())
            .filter((projectDirName) => {
                const projectInfo = this.splitProjectDirName(projectDirName);
                return (
                    projectInfo.projectName === projectName ||
                    projectName === undefined
                );
            })
            .map((project) => this.splitProjectDirName(project).userId);
    }

    static getProjectNameFromUserId(userId: string) {
        return fs
            .readdirSync(this.getProjectDefaultPath())
            .filter((projectDirName) => {
                const projectInfo = this.splitProjectDirName(projectDirName);
                return projectInfo.userId === userId;
            });
    }

    static splitProjectDirName(projectDirName: string) {
        const splitData = projectDirName.split("+");
        return {
            userId: splitData[0],
            projectName: splitData[1],
        };
    }

    static isProjectCreator(
        creatorUserId: string,
        userId: string,
        projectName: string
    ) {
        return (
            (
                getJsonData(
                    this.getProjectDataPath(
                        creatorUserId,
                        projectName,
                        "projectInfo.json"
                    )
                ) as TProjectData
            ).projectCreator === userId
        );
    }

    static isProjectParticipants(
        creatorUserId: string,
        userId: string,
        projectName: string
    ) {
        return (
            getJsonData(
                this.getProjectDataPath(
                    creatorUserId,
                    projectName,
                    "projectInfo.json"
                )
            ) as TProjectData
        ).projectParticipants?.includes(userId);
    }

    static gitCloneFromURL(
        userId: string,
        gitUrl: string,
        projectName: string
    ) {
        const clonePath = this.getProjectWorkPath(userId, projectName);

        if (!fs.existsSync(clonePath)) {
            fs.mkdirSync(clonePath, { recursive: true });
        }

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
    }

    static createProjectFromFile(
        userId: string,
        projectName: string,
        upload: {
            uploadFileId: string;
            isExtract?: boolean;
        }
    ) {
        const fileName = UploadFileManager[upload.uploadFileId].originalname;
        const newPath = this.getProjectWorkPath(userId, projectName);
        if (!fs.existsSync(newPath)) {
            fs.mkdirSync(newPath, { recursive: true });
        }
        return handle(
            `${UploadDirectoryPath}/${upload.uploadFileId}`,
            `${newPath}/${fileName}`,
            {
                isExtract: upload.isExtract,
                extractPath: upload.isExtract ? newPath : undefined,
                extractCallback: (err) => {
                    if (err) {
                        log.error(err.stack);
                    } else {
                        fs.unlinkSync(`${newPath}/${fileName}`);
                        const fileToSize: TUploadFileLanguageToSize = {};
                        searchProjectFiles(newPath, { fileToSize: fileToSize });
                        this.setProjectInfo(userId, projectName, {
                            ...this.getProjectInfo(userId, projectName),
                            projectLanguage: fileToSize,
                        } as TProjectUpdateData);
                    }
                },
            }
        )
            ? true
            : false;
    }

    static get(userId: string, projectName?: string) /*: TProjectData[]*/ {
        if (!fs.existsSync(this.getProjectDefaultPath())) {
            fs.mkdirSync(this.getProjectDefaultPath(), { recursive: true });
        }

        return fs
            .readdirSync(this.getProjectDefaultPath())
            .filter((dirName) => {
                const projectDirName = this.splitProjectDirName(dirName);
                return (
                    (this.isProjectCreator(
                        projectDirName.userId,
                        userId,
                        projectDirName.projectName
                    ) ||
                        this.isProjectParticipants(
                            projectDirName.userId,
                            userId,
                            projectDirName.projectName
                        )) &&
                    (projectDirName.projectName === projectName ||
                        projectName === undefined ||
                        projectName === "")
                );
            })
            .map((project) => {
                const projectDirName = this.splitProjectDirName(project);
                return this.getProjectInfo(
                    projectDirName.userId,
                    projectDirName.projectName
                );
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
        source?: {
            gitUrl?: string;
            upload?: {
                uploadFileId: string;
                isExtract?: boolean;
            };
        }
    ) {
        if (
            this.getUserIdFromProjectName(projectName).filter((getUserId) => {
                this.isProjectCreator(getUserId, userId, projectName) ||
                    this.isProjectParticipants(getUserId, userId, projectName);
            }).length > 0
        ) {
            return false;
        }
        try {
            log.debug(source);
            if (source !== undefined) {
                if (source.gitUrl !== undefined) {
                    this.gitCloneFromURL(userId, source.gitUrl, projectName);
                }
                if (source.upload?.uploadFileId !== undefined) {
                    if (
                        !this.createProjectFromFile(
                            userId,
                            projectName,
                            source.upload
                        )
                    ) {
                        return false;
                    }
                    delete UploadFileManager[source.upload?.uploadFileId];
                }
            }
            if (!fs.existsSync(this.getProjectWorkPath(userId, projectName))) {
                fs.mkdirSync(this.getProjectWorkPath(userId, projectName), {
                    recursive: true,
                });
            }
            if (!fs.existsSync(this.getProjectDataPath(userId, projectName))) {
                fs.mkdirSync(this.getProjectDataPath(userId, projectName), {
                    recursive: true,
                });
            }

            if (projectThumbnail !== undefined) {
                if (
                    !handle(
                        `${UploadDirectoryPath}/${projectThumbnail}`,
                        `${this.getProjectWorkPath(
                            userId,
                            projectName
                        )}${projectThumbnail}`,
                        {}
                    )
                ) {
                    return false;
                }
                delete UploadFileManager[projectThumbnail];
            }

            this.setProjectInfo(userId, projectName, {
                projectName: projectName,
                projectDescription: projectDescription,
                projectThumbnail: projectThumbnail,
                projectCreator: userId,
                projectParticipants: projectParticipants,
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
        projectInfo: TProjectUpdateData
    ): boolean {
        try {
            if (
                this.getUserIdFromProjectName(projectName).filter(
                    (getUserId) => {
                        return this.isProjectCreator(
                            getUserId,
                            userId,
                            projectName
                        );
                    }
                ).length === 0
            ) {
                return false;
            }
            const getUserId = this.getUserIdFromProjectName(projectName);
            const projectData = this.getProjectInfo(getUserId[0], projectName);
            if (projectData === undefined) {
                return false;
            }
            if (
                !this.setProjectInfo(userId, projectName, {
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
        const getUserId = this.getUserIdFromProjectName(projectName).filter(
            (getUserId) => {
                this.isProjectCreator(getUserId, userId, projectName);
            }
        );
        if (getUserId.length === 0) {
            return false;
        }
        if (
            !this.isExists(getUserId[0], projectName, this.getProjectWorkPath)
        ) {
            return false;
        }
        if (!removeData(this.getProjectWorkPath(getUserId[0], projectName))) {
            return false;
        }
        if (
            !this.isExists(getUserId[0], projectName, this.getProjectDataPath)
        ) {
            return false;
        }
        if (!removeData(this.getProjectDataPath(getUserId[0], projectName))) {
            return false;
        }
        return true;
    }

    static export(userId: string, projectName: string) {
        const projectInfo = getJsonData(
            this.getProjectDataPath(userId, projectName)
        );
        fs.unlinkSync(
            this.getProjectDataPath(userId, projectName, "projectInfo.json")
        );
        zip(
            this.getProjectWorkPath(userId, projectName),
            `${this.getProjectWorkPath(userId, projectName)}/${projectName}.zip`
        );
        setJsonData(
            this.getProjectDataPath(userId, projectName, "projectInfo.json"),
            projectInfo
        );
    }

    static getCodesFromProject(
        userId: string,
        { projectName, filePath }: { projectName: string; filePath: string }
    ) {
        const getUserId = DataProjectManager.getUserIdFromProjectName(
            projectName
        ).filter((getUserId) => {
            this.isProjectCreator(getUserId, userId, projectName) ||
                this.isProjectParticipants(getUserId, userId, projectName);
        });
        if (getUserId.length === 0 || getUserId.length > 1) {
            return {};
        }
        const fileData: TFileData = {};
        const codeData = readCodesFromFile(
            this.getProjectWorkPath(getUserId[0], projectName),
            filePath
        );
        if (codeData !== undefined) {
            fileData["filePath"] = filePath;
            fileData["fileContent"] = codeData;
        }
        return fileData;
    }
}
