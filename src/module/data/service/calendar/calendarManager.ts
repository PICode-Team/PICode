import { ResponseCode } from "../../../../constants/response";
import { DataDirectoryPath } from "../../../../types/module/data/data.types";
import { TCalendarData, TScheduleCreateData, TScheduleData } from "../../../../types/module/data/service/calendar/calendar.types";
import { getDateArray, updateDate } from "../../../datetime";
import log from "../../../log";
import { getJsonData, isExists, setJsonData } from "../etc/fileManager";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import DataIssueManager from "../issuespace/issueManager";

const calendarInfoFileName = "calendarInfo.json";

export default class DataCalendarManager {
    /**
     *
     * @description get Calendar path
     * @returns calender path
     */
    static getCalendarPath() {
        return `${DataDirectoryPath}/calendar`;
    }

    /**
     *
     * @description get Calendar Infomation
     * @returns calendarInfo if calendar info file exists, undefined if not
     */
    static getCalendarInfo() {
        const defaultPath = this.getCalendarPath();
        const calendarInfoPath = `${defaultPath}/${calendarInfoFileName}`;
        if (!isExists(calendarInfoPath)) {
            return undefined;
        }
        return getJsonData(calendarInfoPath) as TCalendarData;
    }

    /**
     *
     * @param calendarData calendarData you want to set
     * @description set calendar data to calendar info file
     * @returns true if succeed to set calendar data to calendar info file, false if not
     */
    static setCalendarInfo(calendarData: TCalendarData) {
        const defaultPath = this.getCalendarPath();
        if (!isExists(defaultPath)) {
            return false;
        }

        const calendarInfoPath = `${defaultPath}/${calendarInfoFileName}`;
        return setJsonData(calendarInfoPath, calendarData);
    }

    /**
     *
     * @param scheduleId schedule ID to get schedule
     * @description get schedule which ID is scheduleId
     * @returns schedule infomation which ID is scheduleId
     */
    static getScheduleInfo(scheduleId: string) {
        const calendarInfo = this.getCalendarInfo();
        return Object.values(calendarInfo)
            .find((scheduleListInfo: TScheduleData[]) => {
                return scheduleListInfo.find((scheduleInfo: TScheduleData) => {
                    return scheduleInfo.scheduleId === scheduleId;
                });
            })
            ?.find((scheduleInfo: TScheduleData) => scheduleInfo.scheduleId === scheduleId);
    }

    /**
     *
     * @param issueUUID issue ID to get schedule
     * @description get schedule which issue ID is issueUUID
     * @returns schedule infomation which issue ID is issueUUID
     */
    static getScheduleIdByIssueUUID(issueUUID: string) {
        const calendarInfo = this.getCalendarInfo();
        if (calendarInfo === undefined || calendarInfo === {}) {
            return undefined;
        }
        return Object.values(calendarInfo)
            .find((scheduleListInfo: TScheduleData[]) => {
                return scheduleListInfo.find((scheduleInfo: TScheduleData) => {
                    return scheduleInfo.issue === issueUUID;
                });
            })
            ?.find((scheduleInfo: TScheduleData) => scheduleInfo.issue === issueUUID).scheduleId;
    }

    /**
     *
     * @param calendarInfo calendar infomation
     * @param scheduleId schedule ID to delete from calendarInfo
     * @param date
     * @returns
     */
    static deleteScheduleInfo(calendarInfo: TCalendarData, scheduleId: string, date: string) {
        calendarInfo[date] === undefined ? (calendarInfo[date] = []) : undefined;
        const index = calendarInfo[date]?.findIndex((scheduleInfo: TScheduleData) => {
            return scheduleInfo.scheduleId === scheduleId;
        });
        if (index > -1) {
            calendarInfo[date].splice(index, 1);
        }
        return calendarInfo;
    }

    static addScheduleInfo(calendarInfo: TCalendarData, scheduleData: TScheduleData, date: string) {
        calendarInfo[date] === undefined ? (calendarInfo[date] = []) : undefined;
        const index = calendarInfo[date]?.findIndex((scheduleInfo: TScheduleData) => {
            return scheduleInfo.scheduleId === scheduleData.scheduleId;
        });
        if (index > -1) {
            calendarInfo[date].splice(index, 1);
        }
        calendarInfo[date].push(scheduleData);
        return calendarInfo;
    }

    static getCalendar(options: Partial<TScheduleData>) {
        if (!isExists(this.getCalendarPath())) {
            fs.mkdirSync(this.getCalendarPath(), { recursive: true });
        }
        const calendarInfo = this.getCalendarInfo() ? this.getCalendarInfo() : {};
        return Object.keys(calendarInfo)
            .filter((date) => {
                return (
                    (options.startDate === undefined && options.dueDate === undefined) ||
                    (options.startDate <= date && date <= options.dueDate)
                );
            })
            .reduce((calendarData: TCalendarData, date: string) => {
                const scheduleInfo = calendarInfo[date].filter((scheduleData: TScheduleData) => {
                    return (
                        (options.issue === undefined || scheduleData.issue) &&
                        (options.milestone === undefined || scheduleData.milestone) &&
                        (options.type === undefined || options.type === scheduleData.type) &&
                        (options.title === undefined || options.title === scheduleData.title) &&
                        (options.creator === undefined || options.creator === scheduleData.creator) &&
                        (options.scheduleId === undefined || options.scheduleId === scheduleData.scheduleId)
                    );
                });
                calendarData[date] = scheduleInfo.length > 0 ? scheduleInfo : undefined;
                return calendarData;
            }, {});
    }

    static createSchedule(scheduleData: TScheduleCreateData) {
        if (!isExists(this.getCalendarPath())) {
            fs.mkdirSync(this.getCalendarPath(), { recursive: true });
        }
        if (scheduleData?.startDate === undefined || scheduleData?.dueDate === undefined) {
            log.error(`[DataCalendarManager] create : startdate or dueDate is undefined `);
            return { code: ResponseCode.missingParameter, message: "Please input start date and due date" };
        }
        let startDate = scheduleData.startDate;
        startDate = startDate.split("-")[0]?.length === 4 ? startDate.substr(2) : startDate;
        let dueDate = scheduleData.dueDate;
        dueDate = dueDate.split("-")[0]?.length === 4 ? dueDate.substr(2) : dueDate;

        const calendarInfo = this.getCalendarInfo() ? this.getCalendarInfo() : {};
        const scheduleId = uuidv4();
        try {
            getDateArray(startDate, dueDate).forEach((dateElement) => {
                const calendarCreateData: TScheduleData = { ...scheduleData, scheduleId };
                calendarInfo[dateElement]
                    ? calendarInfo[dateElement].push(calendarCreateData)
                    : (calendarInfo[dateElement] = [calendarCreateData]);
            });
            log.info(`[DataCalendarManager] create : Create schedule`);
            return this.setCalendarInfo(calendarInfo)
                ? { code: ResponseCode.ok, uuid: scheduleId }
                : { code: ResponseCode.internalError, message: "Failed to create schedule data" };
        } catch (err) {
            log.error(err.stack);
            return { code: ResponseCode.internalError, message: "Failed to create schedule data" };
        }
    }

    static updateSchedule(scheduleData: Partial<TScheduleData>) {
        if (scheduleData.scheduleId === undefined) {
            log.error("[DataCalendarManager] update : scheduleId is undefined");
            return { code: ResponseCode.missingParameter, message: "Please input suhedule Id" };
        }
        let newCalendarInfo = this.getCalendarInfo();
        let scheduleInfo: TScheduleData = this.getScheduleInfo(scheduleData.scheduleId);

        if (scheduleData.startDate !== undefined && scheduleData.dueDate !== undefined) {
            getDateArray(scheduleInfo.startDate, scheduleInfo.dueDate).forEach(
                (dateElement) => (newCalendarInfo = this.deleteScheduleInfo(newCalendarInfo, scheduleInfo.scheduleId, dateElement))
            );
            scheduleInfo = { ...scheduleInfo, ...scheduleData };
            getDateArray(scheduleInfo.startDate, scheduleInfo.dueDate).forEach(
                (dateElement) => (newCalendarInfo = this.addScheduleInfo(newCalendarInfo, scheduleInfo, dateElement))
            );
        } else if (scheduleData.startDate === undefined && scheduleData.dueDate === undefined) {
            scheduleInfo = { ...scheduleInfo, ...scheduleData };
            getDateArray(scheduleData.startDate, scheduleData.dueDate).forEach(
                (dateElement) => (newCalendarInfo = this.addScheduleInfo(newCalendarInfo, scheduleInfo, dateElement))
            );
        } else {
        }

        if (scheduleInfo.issue !== undefined) {
            const kanbanUUID = DataIssueManager.getKanbanUUID(scheduleInfo.issue);
            if (kanbanUUID === undefined) {
                log.error(`[DataCalendarManager] update : kanbanUUID is undefined`);
            }
            if (
                DataIssueManager.update(
                    scheduleInfo.creator,
                    kanbanUUID,
                    {
                        uuid: scheduleInfo.issue,
                        title: scheduleInfo.title,
                        creator: scheduleInfo.creator,
                        content: scheduleInfo.content,
                        milestone: scheduleInfo.milestone,
                        startDate: scheduleInfo.startDate,
                        dueDate: scheduleInfo.dueDate,
                    },
                    true
                ).code !== ResponseCode.ok
            ) {
                log.error(`[DataCalendarManager] update : Failed to update issue`);
            }
        }

        if (!this.setCalendarInfo(newCalendarInfo)) {
            log.error(`[DataCalendarManager] update : Failed to set calendar info`);
            return { code: ResponseCode.internalError, message: "Failed to update schedule" };
        }
        log.info(`[DataCalendarManager] update : Update calendar info`);
        return { code: ResponseCode.ok };
    }

    static deleteSchedule({ scheduleId }: Pick<TScheduleData, "scheduleId">) {
        let calendarInfo = this.getCalendarInfo();
        const scheduleInfo = this.getScheduleInfo(scheduleId);
        if (scheduleId === undefined || scheduleInfo == undefined) {
            log.error(`[DataCalendarManager] delete : scheduleId or scheduleInfo is undefined`);
            return { code: ResponseCode.missingParameter, message: "Could not find schedule info" };
        }

        if (scheduleInfo.issue !== undefined) {
            const kanbanUUID = DataIssueManager.getKanbanUUID(scheduleInfo.issue);
            if (DataIssueManager.delete(scheduleInfo.creator, kanbanUUID, scheduleInfo.issue, true).code !== ResponseCode.ok) {
                log.error(`[DataCalendarManager] delete : Failed to delete issue`);
            }
        }

        getDateArray(scheduleInfo.startDate, scheduleInfo.dueDate).forEach(
            (dateElement) => (calendarInfo = this.deleteScheduleInfo(calendarInfo, scheduleId, dateElement))
        );
        if (!this.setCalendarInfo(calendarInfo)) {
            log.error(`[DataCalendarManager] delete : update calendar info`);
            return { code: ResponseCode.internalError, message: "Failed to delete schedule" };
        }
        log.info(`[DataCalendarManager] delete : Delete schedule`);
        return { code: ResponseCode.ok };
    }
}
