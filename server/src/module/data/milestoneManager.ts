import { DataDirectoryPath } from "../../types/module/data/data.types";
import { TMilestoneCreateData, TMilestoneData, TMilestoneJsonData, TMilestoneUpdateData } from "../../types/module/data/milestone.types";
import { getJsonData, isExists, setJsonData } from "./fileManager";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import log from "../log";
import DataAlarmManager from "./alarmManager";
import DataUserManager from "./userManager";

export default class DataMilestoneManager {
    static getMilestonePath(type: "milestoneListInfo.json" | "" = "") {
        return type !== "" ? `${DataDirectoryPath}/issues/${type}` : `${DataDirectoryPath}/issues`;
    }

    static getMilestoneInfo(milestoneUUID?: string) {
        if (!isExists(this.getMilestonePath("milestoneListInfo.json"))) {
            setJsonData(this.getMilestonePath("milestoneListInfo.json"), {});
        }
        const milestoneListData = getJsonData(this.getMilestonePath("milestoneListInfo.json"));
        return milestoneUUID ? (milestoneListData[milestoneUUID] as TMilestoneData) : (milestoneListData as TMilestoneJsonData);
    }

    static setMilestoneInfo(milestoneUUID: string, milestoneData: TMilestoneData) {
        if (!isExists(this.getMilestonePath())) {
            return false;
        }
        const milestoneListData = this.getMilestoneInfo() as TMilestoneJsonData;
        milestoneListData[milestoneUUID] = milestoneData;
        return setJsonData(this.getMilestonePath("milestoneListInfo.json"), milestoneListData) ? true : false;
    }

    static get(options?: Partial<TMilestoneData>) {
        return options?.uuid
            ? this.getMilestoneInfo(options.uuid)
            : Object.values(this.getMilestoneInfo()).filter((mileStoneData) => {
                  return (
                      (options?.content === undefined || options.content === mileStoneData.content) &&
                      (options?.startDate === undefined || options.startDate === mileStoneData.content) &&
                      (options?.endDate === undefined || options.endDate === mileStoneData.endDate) &&
                      (options?.title === undefined || options.title === mileStoneData.title)
                  );
              });
    }

    static create(userId: string, milestoneData: TMilestoneCreateData) {
        const milestoneUUID = uuidv4();
        fs.mkdirSync(this.getMilestonePath(), { recursive: true });
        if (!this.setMilestoneInfo(milestoneUUID, { ...milestoneData, uuid: milestoneUUID })) {
            log.error(`[DataMilestoneManager] create -> fail to setMilestoneInfo`);
            return undefined;
        }
        log.info(`milestoneData created: ${milestoneUUID}`);
        DataAlarmManager.create(userId, {
            type: "milestone",
            location: "",
            content: `${userId} create ${milestoneData.title} milestone (${milestoneData.startDate}~${milestoneData.endDate})`,
            checkAlarm: fs
                .readdirSync(`${DataDirectoryPath}/user`)
                .map((userId) => {
                    return DataUserManager.get(userId)?.userId as string;
                })
                .reduce((list: { [ket in string]: boolean }, member) => {
                    list[member] = true;
                    return list;
                }, {}),
        });
        return milestoneUUID;
    }

    static update(userId: string, milestoneUUID: string, milestoneData: TMilestoneUpdateData) {
        const newMilestoneData = { ...(this.getMilestoneInfo(milestoneUUID) as TMilestoneData), ...milestoneData } as TMilestoneData;
        if (!this.setMilestoneInfo(milestoneUUID, newMilestoneData)) {
            log.error(`[DataMilestoneManager] update -> fail to setMilestoneInfo`);
            return false;
        }

        log.info(`milestoneData updated: ${JSON.stringify(milestoneData)}`);
        DataAlarmManager.create(userId, {
            type: "milestone",
            location: "",
            content: `${userId} update ${newMilestoneData.title} milestone (${newMilestoneData.startDate}~${newMilestoneData.endDate})`,
            checkAlarm: fs
                .readdirSync(`${DataDirectoryPath}/user`)
                .map((userId) => {
                    return DataUserManager.get(userId)?.userId as string;
                })
                .reduce((list: { [ket in string]: boolean }, member) => {
                    list[member] = true;
                    return list;
                }, {}),
        });
        return true;
    }

    static delete(userId: string, milestoneUUID: string) {
        if (milestoneUUID === undefined) {
            log.error(`[DataMilestoneManager] delete -> milestoneUUID is undefined`);
            return false;
        }
        const milestoneListData = this.getMilestoneInfo() as TMilestoneJsonData;
        const deleteMilestoneTitle = milestoneListData[milestoneUUID].title;
        if (!Object.keys(milestoneListData).includes(milestoneUUID)) {
            log.error(`[DataMilestoneManager] delete -> milestoneUUID is not in ListData`);
        }
        delete milestoneListData[milestoneUUID];
        if (!setJsonData(this.getMilestonePath("milestoneListInfo.json"), milestoneListData)) {
            log.error(`[DataMilestoneManager] update -> fail to setMilestoneInfo`);
            return false;
        }
        log.info(`milestoneData deleted: ${JSON.stringify(milestoneUUID)}`);
        DataAlarmManager.create(userId, {
            type: "milestone",
            location: "",
            content: `${userId} delete ${deleteMilestoneTitle} milestone`,
            checkAlarm: fs
                .readdirSync(`${DataDirectoryPath}/user`)
                .map((userId) => {
                    return DataUserManager.get(userId)?.userId as string;
                })
                .reduce((list: { [ket in string]: boolean }, member) => {
                    list[member] = true;
                    return list;
                }, {}),
        });
        return true;
    }
}
