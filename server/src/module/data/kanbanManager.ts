import { DataDirectoryPath } from "../../types/module/data/data.types";
import { TkanbanData } from "../../types/module/data/kanban.types";
import { getJsonData, isExists, setJsonData } from "./fileManager";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import log from "../log";

export default class DataKanbanManager {
    static isExists(kanbanUUID: string) {
        return isExists(this.getKanbanPath(kanbanUUID));
    }

    static getKanbanPath(kanbanUUID?: string, type: "kanbanInfo.json" | "" = "") {
        const kanbanPath = kanbanUUID ? `${DataDirectoryPath}/issues/${kanbanUUID}` : `${DataDirectoryPath}/issues`;
        return type !== "" ? `${kanbanPath}/${type}` : kanbanPath;
    }

    static getKanbanInfo(kanbanUUID: string) {
        if (!this.isExists(kanbanUUID)) {
            return undefined;
        }
        return getJsonData(this.getKanbanPath(kanbanUUID, "kanbanInfo.json")) as TkanbanData;
    }

    static setKanbanInfo(kanbanUUID: string, kanbanData: TkanbanData) {
        if (!this.isExists(kanbanUUID)) {
            return false;
        }

        return setJsonData(this.getKanbanPath(kanbanUUID, "kanbanInfo.json"), kanbanData);
    }

    static get(options: TkanbanData) {
        if (!fs.existsSync(this.getKanbanPath())) {
            fs.mkdirSync(this.getKanbanPath(), { recursive: true });
        }

        const kanbanList: TkanbanData[] = [];
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
                kanbanList.push(this.getKanbanInfo(kanban) as TkanbanData);
            });
        return kanbanList;
    }

    static create(kanbanData: TkanbanData) {
        const kanbanUUID = uuidv4();
        fs.mkdirSync(this.getKanbanPath(kanbanUUID), { recursive: true });
        kanbanData = { uuid: kanbanUUID, columns: ["backlog", "todo", "in progress", "Done"], ...kanbanData };
        if (!this.setKanbanInfo(kanbanUUID, kanbanData)) {
            log.error(`[DataKanbanManager] create -> fail to setKanbanInfo`);
            return undefined;
        }
        setJsonData(`${this.getKanbanPath(kanbanUUID)}/issueList.json`, {});
        log.info(`kanbandata created: ${kanbanData.uuid}`);
        return kanbanUUID;
    }

    static update(kanbanUUID: string, kanbanData: TkanbanData) {
        if (!isExists(this.getKanbanPath(kanbanUUID))) {
            log.error(`[DataKanbanManager] update -> could not find kanbanPath`);
            return false;
        }
        kanbanData = { ...this.getKanbanInfo(kanbanUUID), ...kanbanData };
        if (!this.setKanbanInfo(kanbanUUID, kanbanData)) {
            log.error(`[DataKanbanManager] update -> could not setKanbanInfo`);
            return false;
        }
        log.info(`kanbandata updated: ${{ ...kanbanData }}`);
        return true;
    }
    static delete(kanbanUUID: string) {
        fs.rmdirSync(this.getKanbanPath(kanbanUUID), { recursive: true });
        return true;
    }
}
