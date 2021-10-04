import { DataDirectoryPath, TReturnData } from "../../../../types/module/data/data.types";
import fs from "fs";
import { isExists, getJsonData, setJsonData } from "../etc/fileManager";
import { TIssueData, TIssueListData, TIssueListJsonData, TReturnIssueData } from "../../../../types/module/data/service/issuespace/issue.types";
import { v4 as uuidv4 } from "uuid";
import log from "../../../log";
import DataKanbanManager from "./kanbanManager";
import DataAlarmManager from "../alarm/alarmManager";
import { ResponseCode } from "../../../../constants/response";
import { getTime } from "../../../datetime";
import DataCalendarManager from "../calendar/calendarManager";

const issueListFileName = "issueList.json";
const issueInfoFileName = "issueInfo.json";

export default class DataIssueManager {
    static getIssueListPath(kanbanUUID?: string) {
        return kanbanUUID ? `${DataDirectoryPath}/issues/${kanbanUUID}` : `${DataDirectoryPath}/issues`;
    }

    static getIssueInfoPath(kanbanUUID: string, issueUUID: string) {
        return `${this.getIssueListPath(kanbanUUID)}/${issueUUID}`;
    }

    static getIssueListInfo(kanbanUUID: string) {
        const defaultPath = this.getIssueListPath(kanbanUUID);
        const issueListPath = `${defaultPath}/${issueListFileName}`;
        if (!isExists(issueListPath)) {
            return undefined;
        }

        return getJsonData(issueListPath) as TIssueListJsonData;
    }

    static getIssueInfo(kanbanUUID: string, issueUUID: string) {
        if (!fs.existsSync(this.getIssueListPath(kanbanUUID))) {
            fs.mkdirSync(this.getIssueListPath(kanbanUUID), { recursive: true });
        }
        const defaultPath = this.getIssueInfoPath(kanbanUUID, issueUUID);
        const issueInfoPath = `${defaultPath}/${issueInfoFileName}`;
        if (!isExists(issueInfoPath)) {
            return undefined;
        }

        return getJsonData(issueInfoPath) as TIssueData;
    }

    static setIssueListInfo(kanbanUUID: string, issueUUID: string, addOrDelete: "add" | "delete", issueListData?: TIssueListData) {
        const defaultPath = this.getIssueListPath(kanbanUUID);
        const issueListPath = `${defaultPath}/${issueListFileName}`;
        if (!isExists(issueListPath)) {
            return false;
        }
        const newIssueListData = this.getIssueListInfo(kanbanUUID) ? this.getIssueListInfo(kanbanUUID) : {};
        if (addOrDelete === "add") {
            newIssueListData[issueUUID] = issueListData;
        } else if (addOrDelete === "delete") {
            delete newIssueListData[issueUUID];
        } else {
            log.error(`setIssueListInfo : Invalid type ${addOrDelete}`);
            return false;
        }

        return setJsonData(issueListPath, newIssueListData);
    }

    static setIssueInfo(kanbanUUID: string, issueUUID: string, issueData: TIssueData) {
        const defaultPath = this.getIssueInfoPath(kanbanUUID, issueUUID);
        const issueInfoPath = `${defaultPath}/${issueInfoFileName}`;
        if (!isExists(defaultPath)) {
            return false;
        }

        return setJsonData(issueInfoPath, issueData);
    }

    static getIssueNumber(kanbanUUID: string) {
        const nextIssue = (DataKanbanManager.getKanbanInfo(kanbanUUID)?.nextIssue as number) + 1;
        DataKanbanManager.update(kanbanUUID, { nextIssue });
        return nextIssue;
    }

    static getKanbanUUID(issueUUID: string) {
        return fs.readdirSync(this.getIssueListPath()).find((kanbanUUID) => {
            return Object.keys(this.getIssueListInfo(kanbanUUID)).includes(issueUUID);
        });
    }

    static getList(kanbanUUID?: string, options?: Partial<TIssueListData>) {
        if (!fs.existsSync(this.getIssueListPath(kanbanUUID))) {
            fs.mkdirSync(this.getIssueListPath(kanbanUUID), { recursive: true });
        }

        return fs
            .readdirSync(this.getIssueListPath())
            .filter((kanban) => {
                return kanbanUUID === undefined || kanban === kanbanUUID;
            })
            .reduce((issueList: TIssueListData[], kanban: string) => {
                issueList.push(...Object.values(this.getIssueListInfo(kanban) as TIssueListJsonData));
                return issueList;
            }, [])
            .filter((issueData) => {
                return (
                    (options?.column === undefined || issueData.column === options.column) &&
                    (options?.label === undefined || issueData.label === options.label) &&
                    (options?.assigner === undefined || issueData.assigner === options.assigner) &&
                    (options?.creator === undefined || issueData.creator === options.creator) &&
                    (options?.title === undefined || issueData.title === options.title)
                );
            });
    }

    static create(userId: string, kanbanUUID: string, { title, creator, assigner, label, column, content, milestone, startDate, dueDate }: Omit<TIssueData, "issueId">): TReturnIssueData {
        const issueUUID = uuidv4();
        const issueNumber = this.getIssueNumber(kanbanUUID);

        if (column !== undefined && !DataKanbanManager.getKanbanInfo(kanbanUUID)?.columns?.includes(column)) {
            log.error(`[dataIssueManager] create -> issue's column is not exist`);
            return { code: ResponseCode.invaildRequest, message: "Issue's column is not in kanban board's columns" };
        }

        const issueListData = { uuid: issueUUID, issueId: issueNumber, title, creator, assigner, label, column, content } as TIssueListData;
        if (!this.setIssueListInfo(kanbanUUID, issueUUID, "add", issueListData)) {
            log.error(`[dataIssueManager] create -> fail to setIssueListInfo`);
            return { code: ResponseCode.internalError, message: "Failed to create issue" };
        }

        fs.mkdirSync(this.getIssueInfoPath(kanbanUUID, issueUUID), { recursive: true });

        startDate = startDate ?? getTime(undefined, "YY-MM-DD");
        const issueData = { ...issueListData, content, milestone, kanban: kanbanUUID, startDate, dueDate, creation: startDate } as TIssueData;
        if (!this.setIssueInfo(kanbanUUID, issueUUID, issueData)) {
            log.error(`[dataIssueManager] create -> fail to setIssueInfo`);
            return { code: ResponseCode.internalError, message: "Failed to create issue" };
        }
        if (DataCalendarManager.createSchedule({ type: "public", title, content, startDate, dueDate, milestone, creator, issue: issueUUID }).code !== ResponseCode.ok) {
            log.error(`[dataIssueManager] create -> fail to create schedule`);
            return { code: ResponseCode.internalError, message: "Failed to create issue" };
        }

        DataKanbanManager.updateIssueCount(kanbanUUID, "totalIssue", "increase");
        if (column === "Done") {
            DataKanbanManager.updateIssueCount(kanbanUUID, "doneIssue", "increase");
        }

        log.info(`issue created: issueUUID ${issueData.uuid}`);
        DataAlarmManager.create(userId, {
            type: "issue",
            location: "",
            content: `${userId} create ${issueData.title} issue : creator ${issueData.creator}, assigner ${issueData.assigner}`,
            checkAlarm: { [issueData.creator]: true, [issueData.assigner]: true },
        });
        return { code: ResponseCode.ok, issue: issueData };
    }

    static update(
        userId: string,
        kanbanUUID: string,
        { uuid, issueId, title, creator, assigner, label, column, content, milestone, startDate, dueDate }: Partial<TIssueData>,
        isCallSchedule: boolean = false
    ): TReturnIssueData {
        const issueListJsonData = this.getIssueListInfo(kanbanUUID);
        if (uuid === undefined || issueListJsonData === undefined) {
            log.error(`[dataIssueManager] update -> uuid or issueListJsonData is undefined`);
            return { code: ResponseCode.missingParameter, message: "Could not find issue" };
        }
        const beforeColumn = (issueListJsonData[uuid] as TIssueListData).column;

        if (
            !this.setIssueListInfo(kanbanUUID, uuid, "add", {
                uuid: uuid,
                issueId: issueId ?? issueListJsonData[uuid].issueId,
                title: title ?? issueListJsonData[uuid].title,
                creator: creator ?? issueListJsonData[uuid].creator,
                assigner: assigner ?? issueListJsonData[uuid].assigner,
                label: label ?? issueListJsonData[uuid].label,
                column: column ?? issueListJsonData[uuid].column,
                content: content ?? issueListJsonData[uuid].content,
            })
        ) {
            log.error(`[dataIssueManager] update -> fail to setIssueListInfo`);
            return { code: ResponseCode.internalError, message: "Failed to update issue" };
        }
        const issueData = this.getIssueInfo(kanbanUUID, uuid);
        if (issueData === undefined) {
            log.error(`[dataIssueManager] update -> issueData is undefined`);
            return { code: ResponseCode.internalError, message: "Could not find issue" };
        }
        const updateIssueData = {
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
            startDate: startDate ?? issueData.startDate,
            dueDate: dueDate ?? issueData.dueDate,
        };
        if (!this.setIssueInfo(kanbanUUID, uuid, updateIssueData as TIssueData)) {
            log.error(`[dataIssueManager] update -> fail to setIssueInfo`);
            return { code: ResponseCode.internalError, message: "Failed to update issue" };
        }
        if (beforeColumn === "Done" && column !== undefined && column !== "Done") {
            DataKanbanManager.updateIssueCount(kanbanUUID, "doneIssue", "decrease");
        }
        if (beforeColumn !== "Done" && column === "Done") {
            DataKanbanManager.updateIssueCount(kanbanUUID, "doneIssue", "increase");
        }
        if (isCallSchedule !== true) {
            const scheduleId = DataCalendarManager.getScheduleIdByIssueUUID(uuid);
            if (scheduleId === undefined) {
                log.error(`[dataIssueManager] update -> scheduleId is undefined`);
                return { code: ResponseCode.internalError, message: "scheduleId is undefined" };
            }
            if (DataCalendarManager.updateSchedule({ scheduleId, issue: uuid, title, creator, content, milestone, startDate, dueDate }).code !== ResponseCode.ok) {
                log.error(`[dataIssueManager] update -> Failed to update schedule`);
                return { code: ResponseCode.internalError, message: "Failed to update schedule" };
            }
        }

        log.info(`[dataIssueManager] update -> issue updated : ${JSON.stringify(updateIssueData)}`);
        DataAlarmManager.create(userId, {
            type: "issue",
            location: "",
            content: `${userId} update ${title ?? issueData.title} issue`,
            checkAlarm: { [creator ?? issueData.creator]: true, [assigner ?? issueData.assigner]: true },
        });
        return { code: ResponseCode.ok, issue: updateIssueData };
    }

    static delete(userId: string, kanbanUUID: string, issueUUID: string, isCallSchedule: boolean = false): TReturnData {
        const issueListJsonData = this.getIssueListInfo(kanbanUUID);
        if (issueListJsonData === undefined || issueUUID == undefined) {
            log.error(`[dataIssueManager] delete -> isueListJsonData is undefined`);
            return { code: ResponseCode.invaildRequest, message: "Could not find issue" };
        }

        const deleteIssueInfo = issueListJsonData[issueUUID];
        if (issueListJsonData[issueUUID].column === "Done") {
            DataKanbanManager.updateIssueCount(kanbanUUID, "doneIssue", "decrease");
        }
        if (!Object.keys(issueListJsonData).includes(issueUUID)) {
            log.error(`[dataIssueManager] delete -> issueUUID is not in issueList`);
            return { code: ResponseCode.invaildRequest, message: "Could not find issue" };
        }

        if (!this.setIssueListInfo(kanbanUUID, issueUUID, "delete")) {
            log.error(`[dataIssueManager] delete -> fail to delete issueData from issueList.json`);
            return { code: ResponseCode.internalError, message: "Failed to delete issue" };
        }
        fs.rmdirSync(this.getIssueInfoPath(kanbanUUID, issueUUID), { recursive: true });
        DataKanbanManager.updateIssueCount(kanbanUUID, "totalIssue", "decrease");

        if (isCallSchedule !== true) {
            const scheduleId = DataCalendarManager.getScheduleIdByIssueUUID(issueUUID);
            if (DataCalendarManager.deleteSchedule({ scheduleId }).code !== ResponseCode.ok) {
                log.error(`[dataIssueManager] delete -> Failed to delete schedule`);
                return { code: ResponseCode.internalError, message: "Failed to delete schedule" };
            }
        }

        log.info(`issue deleted: ${issueUUID}`);
        DataAlarmManager.create(userId, {
            type: "issue",
            location: "",
            content: `${userId} delete ${deleteIssueInfo.title} issue`,
            checkAlarm: { [deleteIssueInfo.creator]: true, [deleteIssueInfo.assigner]: true },
        });
        return { code: ResponseCode.ok };
    }
}
