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
    findProjectLanguage,
} from "./fileManager";
import fs from "fs";
import * as child from "child_process";
import { zip } from "zip-a-folder";
import { TUploadFileLanguageToSize } from "../../types/module/data/file.types";

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

    static splitProjectDirName(projectDirName: string) {
        const splitData = projectDirName.split("+");
        return {
            userId: splitData[0],
            projectName: splitData[1],
        };
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
            (error, stdout, stderr) => {
                error
                    ? log.error(error)
                    : (log.info(stdout), log.error(stderr));
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
                        findProjectLanguage(newPath, fileToSize);
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

    static get(userId: string, projectName?: string): TProjectData[] {
        return fs
            .readdirSync(this.getProjectDefaultPath())
            .filter((projectDirName) => {
                const projectInfo = this.splitProjectDirName(projectDirName);
                return (
                    projectInfo.userId === userId &&
                    (projectInfo.projectName === projectName ||
                        projectName === undefined ||
                        projectName === "")
                );
            })
            .map((project) =>
                this.getProjectInfo(
                    userId,
                    this.splitProjectDirName(project).projectName
                )
            ) as TProjectData[];
    }

    static create(
        userId: string,
        {
            projectName,
            projectDescription,
            projectThumbnail,
        }: TprojectCreateData,
        source: {
            gitUrl?: string;
            upload?: {
                uploadFileId: string;
                isExtract?: boolean;
            };
        }
    ) {
        if (source.gitUrl !== undefined) {
            this.gitCloneFromURL(userId, source.gitUrl, projectName);
        }
        if (source.upload?.uploadFileId !== undefined) {
            this.createProjectFromFile(userId, projectName, source.upload);
            delete UploadFileManager[source.upload?.uploadFileId];
        }
        if (projectThumbnail !== undefined) {
            handle(
                `${UploadDirectoryPath}/${projectThumbnail}`,
                `${this.getProjectWorkPath(
                    userId,
                    projectName
                )}/${projectThumbnail}`,
                {}
            );
            delete UploadFileManager[projectThumbnail];
        }
        if (!fs.existsSync(this.getProjectDataPath(userId, projectName))) {
            fs.mkdirSync(this.getProjectDataPath(userId, projectName), {
                recursive: true,
            });
        }
        this.setProjectInfo(userId, projectName, {
            projectName: projectName,
            projectDescription: projectDescription,
            projectThumbnail: projectThumbnail,
        });
    }

    static update(
        userId: string,
        projectName: string,
        projectInfo: TProjectUpdateData
    ): boolean {
        try {
            const projectData = this.getProjectInfo(userId, projectName);
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
        if (!this.isExists(userId, projectName, this.getProjectWorkPath)) {
            return false;
        }
        if (!removeData(this.getProjectWorkPath(userId, projectName))) {
            return false;
        }
        if (!this.isExists(userId, projectName, this.getProjectDataPath)) {
            return false;
        }
        if (!removeData(this.getProjectDataPath(userId, projectName))) {
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
}
