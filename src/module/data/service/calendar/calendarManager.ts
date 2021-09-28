import { ResponseCode } from "../../../../constants/response";
import { DataDirectoryPath } from "../../../../types/module/data/data.types";
import { TCalendarData, TScheduleCreateData, TScheduleData } from "../../../../types/module/data/service/calendar/calendar.types";
import { updateDate } from "../../../datetime";
import log from "../../../log";
import { getJsonData, isExists, setJsonData } from "../etc/fileManager";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

const calendarInfoFileName = "calendarInfo.json";

export default class DataCalendarManager {
    static getCalendarPath() {
        return `${DataDirectoryPath}/calendar`;
    }

    static getCalendarInfo() {
        const defaultPath = this.getCalendarPath();
        const calendarInfoPath = `${defaultPath}/${calendarInfoFileName}`;
        if (!isExists(calendarInfoPath)) {
            return undefined;
        }
        return getJsonData(calendarInfoPath) as TCalendarData;
    }

    static setCalendarInfo(calendarData: TCalendarData) {
        const defaultPath = this.getCalendarPath();
        if (!isExists(defaultPath)) {
            return false;
        }

        const calendarInfoPath = `${defaultPath}/${calendarInfoFileName}`;
        return setJsonData(calendarInfoPath, calendarData);
    }

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

    static getScheduleIdByIssueUUID(issueUUID: string) {
        const calendarInfo = this.getCalendarInfo();
        return Object.values(calendarInfo)
            .find((scheduleListInfo: TScheduleData[]) => {
                return scheduleListInfo.find((scheduleInfo: TScheduleData) => {
                    return scheduleInfo.issue === issueUUID;
                });
            })
            ?.find((scheduleInfo: TScheduleData) => scheduleInfo.issue === issueUUID).scheduleId;
    }

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
                return (options.startDate === undefined && options.dueDate === undefined) || (options.startDate <= date && date <= options.dueDate);
            })
            .reduce((calendarData: TCalendarData, date: string) => {
                calendarData[date] = calendarInfo[date].filter((scheduleData: TScheduleData) => {
                    return (
                        (options.issue === undefined || scheduleData.issue) &&
                        (options.milestone === undefined || scheduleData.milestone) &&
                        (options.type === undefined || options.type === scheduleData.type) &&
                        (options.title === undefined || options.title === scheduleData.title) &&
                        (options.creator === undefined || options.creator === scheduleData.creator) &&
                        (options.scheduleId === undefined || options.scheduleId === scheduleData.scheduleId)
                    );
                });
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
        const calendarInfo = this.getCalendarInfo() ? this.getCalendarInfo() : {};
        const scheduleId = uuidv4();
        try {
            for (let dateElement = scheduleData.startDate; dateElement <= scheduleData.dueDate; dateElement = updateDate(dateElement, 1)) {
                const calendarCreateData: TScheduleData = { ...scheduleData, scheduleId };
                calendarInfo[dateElement] ? calendarInfo[dateElement].push(calendarCreateData) : (calendarInfo[dateElement] = [calendarCreateData]);
            }
            log.info(`[DataCalendarManager] create : Create schedule`);
            return this.setCalendarInfo(calendarInfo) ? { code: ResponseCode.ok, uuid: scheduleId } : { code: ResponseCode.internalError, message: "Failed to create schedule data" };
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

        if (scheduleData.startDate !== undefined && scheduleData.dueDate !== undefined) {
            let scheduleInfo: TScheduleData = this.getScheduleInfo(scheduleData.scheduleId);
            for (let dateElement = scheduleInfo.startDate; dateElement <= scheduleInfo.dueDate; dateElement = updateDate(dateElement, 1)) {
                newCalendarInfo = this.deleteScheduleInfo(newCalendarInfo, scheduleInfo.scheduleId, dateElement);
            }

            scheduleInfo = { ...scheduleInfo, ...scheduleData };
            for (let dateElement = scheduleData.startDate; dateElement <= scheduleData.dueDate; dateElement = updateDate(dateElement, 1)) {
                newCalendarInfo = this.addScheduleInfo(newCalendarInfo, scheduleInfo, dateElement);
            }
        } else if (scheduleData.startDate === undefined && scheduleData.dueDate === undefined) {
            const scheduleInfo: TScheduleData = { ...this.getScheduleInfo(scheduleData.scheduleId), ...scheduleData };
            for (let dateElement = scheduleData.startDate; dateElement <= scheduleData.dueDate; dateElement = updateDate(dateElement, 1)) {
                newCalendarInfo = this.addScheduleInfo(newCalendarInfo, scheduleInfo, dateElement);
            }
        } else {
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
        if (scheduleId === undefined) {
            log.error(`[DataCalendarManager] delete : scheduleId is undefined`);
            return { code: ResponseCode.missingParameter, message: "Please input schedule ID" };
        }
        const scheduleInfo = this.getScheduleInfo(scheduleId);
        for (let dateElement = scheduleInfo?.startDate; dateElement <= scheduleInfo?.dueDate; dateElement = updateDate(dateElement, 1)) {
            calendarInfo = this.deleteScheduleInfo(calendarInfo, scheduleId, dateElement);
        }
        if (!this.setCalendarInfo(calendarInfo)) {
            log.error(`[DataCalendarManager] delete : update calendar info`);
            return { code: ResponseCode.internalError, message: "Failed to delete schedule" };
        }
        log.info(`[DataCalendarManager] delete : Delete schedule`);
        return { code: ResponseCode.ok };
    }
}
