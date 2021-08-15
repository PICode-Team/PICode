import { DataDirectoryPath } from "../../types/module/data/data.types";
import { TMilestoneData, TMilestoneJsonData } from "../../types/module/data/milestone.types";
import { getJsonData, isExists, setJsonData } from "./fileManager";
import { v4 as uuidv4 } from "uuid";

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
        if (!isExists(this.getMilestonePath("milestoneListInfo.json"))) {
            return false;
        }
        const milestoneListData = this.getMilestoneInfo() as TMilestoneJsonData;
        milestoneListData[milestoneUUID] = milestoneData;
        return setJsonData(this.getMilestonePath("milestoneListInfo.json"), milestoneListData) ? true : false;
    }

    static get(milestoneUUID?: string) {
        return milestoneUUID ? this.getMilestoneInfo(milestoneUUID) : Object.values(this.getMilestoneInfo());
    }
    static create(milestoneData: TMilestoneData) {
        const milestoneUUID = uuidv4();
        return this.setMilestoneInfo(milestoneUUID, milestoneData) ? milestoneUUID : undefined;
    }
    static update(milestoneData: TMilestoneData) {
        const newMilestoneData = { ...(this.getMilestoneInfo() as TMilestoneJsonData), ...milestoneData };
        return this.setMilestoneInfo(milestoneData.uuid, newMilestoneData) ? true : false;
    }
    static delete(milestoneUUID: string) {
        const milestoneListData = this.getMilestoneInfo() as TMilestoneJsonData;
        delete milestoneListData[milestoneUUID];

        return setJsonData(this.getMilestonePath("milestoneListInfo.json"), milestoneListData) ? true : false;
    }
}
