import { DataDirectoryPath } from "../../types/module/data/data.types";
import fs from "fs";
import { isExists, getJsonData, setJsonData } from "./fileManager";
import { TIssueData, TIssueListData, TIssueListJsonData } from "../../types/module/data/issue.types";
import { v4 as uuidv4 } from "uuid";
import log from "../log";

export default class DataIssueManager {
    static getIssueListPath(kanbanUUID: string, type: "issueList.json" | "" = "") {
        return type !== "" ? `${DataDirectoryPath}/issues/${kanbanUUID}/${type}` : `${DataDirectoryPath}/issues/${kanbanUUID}`;
    }

    static getIssueInfoPath(kanbanUUID: string, issueUUID: string, type: "issueInfo.json" | "" = "") {
        return type !== "" ? `${this.getIssueListPath(kanbanUUID)}/${issueUUID}/${type}` : `${this.getIssueListPath(kanbanUUID)}/${issueUUID}`;
    }

    static getIssueListInfo(kanbanUUID: string) {
        if (!isExists(this.getIssueListPath(kanbanUUID, "issueList.json"))) {
            return undefined;
        }

        return getJsonData(this.getIssueListPath(kanbanUUID, "issueList.json")) as TIssueListJsonData;
    }

    static getIssueInfo(kanbanUUID: string, issueUUID: string) {
        if (!isExists(this.getIssueInfoPath(kanbanUUID, issueUUID, "issueInfo.json"))) {
            return undefined;
        }

        return getJsonData(this.getIssueInfoPath(kanbanUUID, issueUUID, "issueInfo.json")) as TIssueData;
    }

    static setIssueListInfo(kanbanUUID: string, issueUUID: string, issueListData: TIssueListData) {
        if (!isExists(this.getIssueListPath(kanbanUUID)) || this.getIssueListInfo(kanbanUUID) === undefined) {
            return false;
        }
        const newIssueListData = this.getIssueListInfo(kanbanUUID) as TIssueListJsonData;
        newIssueListData[issueUUID] = issueListData;
        return setJsonData(this.getIssueListPath(kanbanUUID, "issueList.json"), issueListData);
    }

    static setIssueInfo(kanbanUUID: string, issueUUID: string, issueData: TIssueData) {
        if (!isExists(this.getIssueInfoPath(kanbanUUID, issueUUID))) {
            return false;
        }

        return setJsonData(this.getIssueInfoPath(kanbanUUID, issueUUID, "issueInfo.json"), issueData);
    }

    static isCreatorOrAssigner(userId: string, kanbanUUID: string, issueUUID: string) {
        const issueListInfo = this.getIssueListInfo(kanbanUUID);
        return issueListInfo !== undefined ? issueListInfo[issueUUID].assigner === userId || issueListInfo[issueUUID].creator === userId : false;
    }

    static get(kanbanUUID: string, issueUUID?: string) {
        if (!fs.existsSync(this.getIssueListPath(kanbanUUID))) {
            fs.mkdirSync(this.getIssueListPath(kanbanUUID), { recursive: true });
        }
        return issueUUID ? this.getIssueInfo(kanbanUUID, issueUUID) : this.getIssueListInfo(kanbanUUID);
    }

    static create(kanbanUUID: string, { issueId, title, creator, assigner, label, column, content, projectName, milestone }: TIssueData) {
        const issueUUID = uuidv4();
        const issueListData = { issueUUID, issueId, title, creator, assigner, label, column } as TIssueListData;
        if (!this.setIssueListInfo(kanbanUUID, issueUUID, issueListData)) {
            log.error(`[dataIssueManager] create -> fail to setIssueListInfo`);
            return undefined;
        }
        const issueData = { ...issueListData, content, projectName, milestone } as TIssueData;
        if (!this.setIssueInfo(kanbanUUID, issueUUID, issueData)) {
            log.error(`[dataIssueManager] create -> fail to setIssueInfo`);
            return undefined;
        }
        return issueUUID;
    }

    static update(kanbanUUID: string, { uuid, issueId, title, creator, assigner, label, column, content, projectName, milestone }: TIssueData) {
        const issueListJsonData = this.getIssueListInfo(kanbanUUID);
        if (uuid === undefined || issueListJsonData === undefined) {
            log.error(`[dataIssueManager] update -> uuid or issueListJsonData is undefined`);
            return false;
        }

        const issueListData = { ...issueListJsonData[uuid], uuid, issueId, title, creator, assigner, label, column };
        if (!this.setIssueListInfo(kanbanUUID, uuid, issueListData)) {
            log.error(`[dataIssueManager] update -> fail to setIssueListInfo`);
            return false;
        }
        const issueData = this.getIssueInfo(kanbanUUID, uuid);
        if (issueData === undefined) {
            log.error(`[dataIssueManager] update -> issueData is undefined`);
            return false;
        }
        if (!this.setIssueInfo(kanbanUUID, uuid, { ...issueData, title, creator, assigner, label, column, content, projectName, milestone })) {
            log.error(`[dataIssueManager] update -> fail to setIssueInfo`);
            return false;
        }
        return true;
    }

    static delete(kanbanUUID: string, issueUUID: string) {
        const issueListJsonData = this.getIssueListInfo(kanbanUUID);
        if (issueListJsonData === undefined) {
            return false;
        }
        delete issueListJsonData[issueUUID];
        fs.rmdirSync(this.getIssueInfoPath(kanbanUUID, issueUUID), { recursive: true });
        return true;
    }
}
