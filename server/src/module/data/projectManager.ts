import log from "../../module/log";
import { WorkDirectoryPath } from "../../types/module/data/data.types";
import { TProjectData, TProjectUpdateData } from "../../types/module/data/project.type";
import { setJsonData, getJsonData, isExists, removeData } from "./fileManager";
import fs from "fs";

export default class DataProjectManager {
    static isExists(userId: string, projectName: string) {
        return isExists(this.getProjectPath(userId, projectName));
    }

    static getProjectDefaultPath() {
        return `${WorkDirectoryPath}/project`;
    }

    static getProjectPath(userId: string, projectName: string, type: "" | "projectInfo.json" = "") {
        return `${WorkDirectoryPath}/project/${userId}+${projectName}/${type}`;
    }

    static getProjectInfo(userId: string, projectName: string) {
        if (!this.isExists(userId, projectName)) {
            return undefined;
        }

        return getJsonData(this.getProjectPath(userId, projectName, "projectInfo.json")) as TProjectData;
    }

    static setProjectInfo(userId: string, projectName: string, data: TProjectData) {
        if (!this.isExists(userId, projectName)) {
            return undefined;
        }

        if (data.projectName !== undefined) {
            fs.renameSync(this.getProjectPath(userId, projectName), this.getProjectPath(userId, data.projectName));
        }

        return setJsonData(this.getProjectPath(userId, data.projectName ?? projectName, "projectInfo.json"), data);
    }

    static splitProjectDirName(projectDirName: string) {
        const splitData = projectDirName.split("+");
        return {
            userId: splitData[0],
            projectName: splitData[1],
        };
    }

    static get(userId: string, projectName?: string): TProjectData[] {
        return fs
            .readdirSync(this.getProjectDefaultPath())
            .filter((projectDirName) => {
                const projectInfo = this.splitProjectDirName(projectDirName);
                return projectInfo.userId === userId && (projectInfo.projectName === projectName || projectName === undefined || projectName === "");
            })
            .map((project) => this.getProjectInfo(userId, this.splitProjectDirName(project).projectName)) as TProjectData[];
    }

    static update(userId: string, projectName: string, projectInfo: TProjectUpdateData): boolean {
        try {
            const projectData = this.getProjectInfo(userId, projectName);
            if (projectData === undefined) {
                return false;
            }

            if (
                !this.setProjectInfo(userId, projectName, {
                    projectId: projectData.projectId,
                    projectName: projectInfo.projectName ?? projectData.projectName,
                    projectDescription: projectInfo.projectDescription ?? projectData.projectDescription,
                    projectThumbnail: projectInfo.projectThumbnail ?? projectData.projectThumbnail,
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
        if (!this.isExists(userId, projectName)) {
            return false;
        }
        return removeData(this.getProjectPath(userId, projectName));
    }
}
