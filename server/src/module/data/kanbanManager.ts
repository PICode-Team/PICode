import { WorkDirectoryPath } from "../../types/module/data/data.types";
import { TkanbanData } from "../../types/module/data/kanban.types";
import { getJsonData, isExists, setJsonData } from "./fileManager";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import log from "../log";

export default class DataKanbanManager {
    static getKanbanPath(kanbanUUID?: string, type: "kanbanInfo.json" | "" = "") {
        const kanbanPath = kanbanUUID ? `${WorkDirectoryPath}/issues/${kanbanUUID}` : `${WorkDirectoryPath}/issues`;
        return type !== "" ? `${kanbanPath}/${type}` : kanbanPath;
    }

    static getKanbanInfo(kanbanUUID: string) {
        if (!isExists(this.getKanbanPath(kanbanUUID))) {
            return undefined;
        }
        return getJsonData(this.getKanbanPath(kanbanUUID, "kanbanInfo.json")) as TkanbanData;
    }

    static setKanbanInfo(kanbanUUID: string, kanbanData: TkanbanData) {
        if (!isExists(this.getKanbanPath(kanbanUUID))) {
            return false;
        }
        return setJsonData(this.getKanbanPath(kanbanUUID, "kanbanInfo.json"), kanbanData);
    }

    static get(options: TkanbanData) {
        if (!fs.existsSync(this.getKanbanPath())) {
            fs.mkdirSync(this.getKanbanPath(), { recursive: true });
        }

        const kanbanList: { [key in string]: TkanbanData } = {};
        fs.readdirSync(this.getKanbanPath())
            .filter((kanban) => {
                const kanbanData = this.getKanbanInfo(kanban);
                return (
                    (options.uuid === undefined || options.uuid === kanbanData?.uuid) &&
                    (options.column === undefined || (options.column as string) in (kanbanData?.columns as string[])) &&
                    (options.projectName === undefined || options.projectName === kanbanData?.projectName) &&
                    (options.milestone === undefined || options.milestone === kanbanData?.milestone)
                );
            })
            .map((kanban) => {
                kanbanList[kanban] = this.getKanbanInfo(kanban) as TkanbanData;
            });
        return kanbanList;
    }
    static create(kanbanData: TkanbanData) {
        const kanbanUUID = uuidv4();
        fs.mkdirSync(this.getKanbanPath(kanbanUUID), { recursive: true });
        kanbanData = { ...kanbanData, uuid: kanbanUUID };
        if (!this.setKanbanInfo(this.getKanbanPath(kanbanUUID, "kanbanInfo.json"), kanbanData)) {
            log.error(`[DataKanbanManager] create -> fail to setKanbanInfo`);
            return undefined;
        }
        return kanbanUUID;
    }
    static update(kanbanUUID: string, kanbanData: TkanbanData) {
        if (!isExists(this.getKanbanPath(kanbanUUID))) {
            log.error(`[DataKanbanManager] update -> could not find kanbanPath`);
            return false;
        }
        kanbanData = { ...this.getKanbanInfo(kanbanUUID), ...kanbanData };
        if (!this.setKanbanInfo(this.getKanbanPath(kanbanUUID), kanbanData)) {
            log.error(`[DataKanbanManager] update -> could not setKanbanInfo`);
            return false;
        }
        return true;
    }
    static delete(kanbanUUID: string) {
        fs.rmdirSync(this.getKanbanPath(kanbanUUID), { recursive: true });
        return true;
    }
}
