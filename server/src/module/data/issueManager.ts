import { DataDirectoryPath } from "../../types/module/data/data.types";
import fs from "fs";
import { isExists, getJsonData, setJsonData } from "./fileManager";
import { TIssueData, TIssueListData, TIssueListJsonData } from "../../types/module/data/issue.types";
import { v4 as uuidv4 } from "uuid";
import log from "../log";
import DataKanbanManager from "./kanbanManager";

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

    static getList(kanbanUUID?: string, options?: Partial<TIssueListData>) {
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
        return this.getIssueInfo(kanbanUUID, issueUUID);
    }

    static create(kanbanUUID: string, { title, creator, assigner, label, column, content, milestone }: TIssueData) {
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

        const issueData = { ...issueListData, content, milestone, kanban: kanbanUUID } as TIssueData;
        if (!this.setIssueInfo(kanbanUUID, issueUUID, issueData)) {
            log.error(`[dataIssueManager] create -> fail to setIssueInfo`);
            return undefined;
        }
        DataKanbanManager.updateIssueCount(kanbanUUID, "totalIssue", "increase");
        if (column === "Done") {
            DataKanbanManager.updateIssueCount(kanbanUUID, "doneIssue", "increase");
        }

        log.info(`issue created: issueUUID ${issueData.uuid}`);
        return issueUUID;
    }

    static update(kanbanUUID: string, { uuid, issueId, title, creator, assigner, label, column, content, milestone }: Partial<TIssueData>) {
        const issueListJsonData = this.getIssueListInfo(kanbanUUID);
        if (uuid === undefined || issueListJsonData === undefined) {
            log.error(`[dataIssueManager] update -> uuid or issueListJsonData is undefined`);
            return false;
        }
        const beforeColumn = (issueListJsonData[uuid] as TIssueListData).column;

        if (
            !this.setIssueListInfo(kanbanUUID, uuid, {
                uuid: uuid,
                issueId: issueId ?? issueListJsonData[uuid].issueId,
                title: title ?? issueListJsonData[uuid].title,
                creator: creator ?? issueListJsonData[uuid].creator,
                assigner: assigner ?? issueListJsonData[uuid].assigner,
                label: label ?? issueListJsonData[uuid].label,
                column: column ?? issueListJsonData[uuid].column,
            })
        ) {
            log.error(`[dataIssueManager] update -> fail to setIssueListInfo`);
            return false;
        }
        const issueData = this.getIssueInfo(kanbanUUID, uuid);
        if (issueData === undefined) {
            log.error(`[dataIssueManager] update -> issueData is undefined`);
            return false;
        }
        if (
            !this.setIssueInfo(kanbanUUID, uuid, {
                uuid: uuid,
                issueId: issueData.issueId,
                title: title ?? issueData.title,
                creator: creator ?? issueData.creator,
                assigner: assigner ?? issueData.assigner,
                label: label ?? issueData.label,
                column: column ?? issueData.column,
                content: content ?? issueData.content,
                milestone: milestone ?? issueData.milestone,
                kanban: issueData.kanban,
            } as TIssueData)
        ) {
            log.error(`[dataIssueManager] update -> fail to setIssueInfo`);
            return false;
        }
        if (beforeColumn === "Done" && column !== undefined && column !== "Done") {
            DataKanbanManager.updateIssueCount(kanbanUUID, "doneIssue", "decrease");
        }
        if (beforeColumn !== "Done" && column === "Done") {
            DataKanbanManager.updateIssueCount(kanbanUUID, "doneIssue", "increase");
        }
        log.info(`issue updated: ${JSON.stringify(issueData)}`);
        return true;
    }

    static delete(kanbanUUID: string, issueUUID: string) {
        const issueListJsonData = this.getIssueListInfo(kanbanUUID);
        if (issueListJsonData === undefined) {
            log.error(`[dataIssueManager] delete -> isueListJsonData is undefined`);
            return false;
        }
        if (issueListJsonData[issueUUID].column === "Done") {
            DataKanbanManager.updateIssueCount(kanbanUUID, "doneIssue", "decrease");
        }
        delete issueListJsonData[issueUUID];
        if (!setJsonData(this.getIssueListPath(kanbanUUID, "issueList.json"), issueListJsonData)) {
            log.error(`[dataIssueManager] delete -> fail to delete issueData from issueList.json`);
            return false;
        }
        fs.rmdirSync(this.getIssueInfoPath(kanbanUUID, issueUUID), { recursive: true });
        DataKanbanManager.updateIssueCount(kanbanUUID, "totalIssue", "decrease");
        log.info(`issue deleted: ${issueUUID}`);
        return true;
    }
}
