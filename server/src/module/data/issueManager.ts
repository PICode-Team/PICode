import { DataDirectoryPath } from "../../types/module/data/data.types";
import fs from "fs";
import { isExists, getJsonData, setJsonData } from "./fileManager";
import { TIssueData, TIssueListData, TIssueListJsonData } from "../../types/module/data/issue.types";
import { v4 as uuidv4 } from "uuid";
import log from "../log";

export default class DataIssueManager {
    static getIssueListPath(kanbanUUID?: string, type: "issueList.json" | "" = "") {
        const issueListPath = kanbanUUID ? `${DataDirectoryPath}/issues/${kanbanUUID}` : `${DataDirectoryPath}/issues`;
        return type !== "" ? `${issueListPath}/${type}` : issueListPath;
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
        if (!isExists(this.getIssueInfoPath(kanbanUUID, issueUUID))) {
            return undefined;
        }

        return getJsonData(this.getIssueInfoPath(kanbanUUID, issueUUID, "issueInfo.json")) as TIssueData;
    }

    static setIssueListInfo(kanbanUUID: string, issueUUID: string, issueListData: TIssueListData) {
        if (!isExists(this.getIssueListPath(kanbanUUID))) {
            return false;
        }
        const newIssueListData = this.getIssueListInfo(kanbanUUID) ? (this.getIssueListInfo(kanbanUUID) as TIssueListJsonData) : ({} as TIssueListJsonData);
        newIssueListData[issueUUID] = issueListData;
        return setJsonData(this.getIssueListPath(kanbanUUID, "issueList.json"), newIssueListData);
    }

    static setIssueInfo(kanbanUUID: string, issueUUID: string, issueData: TIssueData) {
        if (!isExists(this.getIssueInfoPath(kanbanUUID, issueUUID))) {
            return false;
        }

        return setJsonData(this.getIssueInfoPath(kanbanUUID, issueUUID, "issueInfo.json"), issueData);
    }

    static getIssueNumber(kanbanUUID: string) {
        return this.getIssueListInfo(kanbanUUID) !== undefined ? Object.keys(this.getIssueListInfo(kanbanUUID) as TIssueListJsonData).length + 1 : 1;
    }

    static getList(kanbanUUID?: string, options?: TIssueListData) {
        if (!fs.existsSync(this.getIssueListPath(kanbanUUID))) {
            fs.mkdirSync(this.getIssueListPath(kanbanUUID), { recursive: true });
        }
        const issueList: TIssueListData[] = [];
        fs.readdirSync(this.getIssueListPath())
            .filter((kanban) => {
                return kanbanUUID === undefined || kanban === kanbanUUID;
            })
            .map((kanban) => {
                issueList.push(...Object.values(this.getIssueListInfo(kanban) as TIssueListJsonData));
            });
        return issueList.filter((issueData) => {
            return (
                (options?.column === undefined || issueData.column === options.column) &&
                (options?.label === undefined || issueData.label === options.label) &&
                (options?.assigner === undefined || issueData.assigner === options.assigner) &&
                (options?.creator === undefined || issueData.creator === options.creator) &&
                (options?.title === undefined || issueData.title === options.title)
            );
        });
    }

    static getInfo(kanbanUUID: string, issueUUID: string) {
        if (!fs.existsSync(this.getIssueListPath(kanbanUUID))) {
            fs.mkdirSync(this.getIssueListPath(kanbanUUID), { recursive: true });
        }
        this.getIssueInfo(kanbanUUID, issueUUID);
    }

    static create(kanbanUUID: string, { title, creator, assigner, label, column, content, projectName, milestone }: TIssueData) {
        const issueUUID = uuidv4();
        const issueNumber = this.getIssueNumber(kanbanUUID);
        const issueListData = { uuid: issueUUID, issueId: issueNumber, title, creator, assigner, label, column } as TIssueListData;
        if (!this.setIssueListInfo(kanbanUUID, issueUUID, issueListData)) {
            log.error(`[dataIssueManager] create -> fail to setIssueListInfo`);
            return undefined;
        }

        if (!fs.existsSync(this.getIssueInfoPath(kanbanUUID, issueUUID))) {
            fs.mkdirSync(this.getIssueInfoPath(kanbanUUID, issueUUID), { recursive: true });
        }

        const issueData = { ...issueListData, content, projectName, milestone } as TIssueData;
        if (!this.setIssueInfo(kanbanUUID, issueUUID, issueData)) {
            log.error(`[dataIssueManager] create -> fail to setIssueInfo`);
            return undefined;
        }
        log.info(`issue created: issueUUID ${issueData.uuid}`);
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
        log.info(`issue updated: ${issueData}`);
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
