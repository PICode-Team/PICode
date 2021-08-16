import { DataDirectoryPath } from "../../types/module/data/data.types";
import { TkanbanCreateData, TkanbanData } from "../../types/module/data/kanban.types";
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

    static updateIssueCount(kanbanUUID: string, type: "totalIssue" | "doneIssue", incOrDec: "increase" | "decrease") {
        const kanbanData = this.getKanbanInfo(kanbanUUID) as TkanbanData;

        if (type == "totalIssue") {
            if (incOrDec == "increase") {
                this.update(kanbanUUID, { totalIssue: (kanbanData.totalIssue as number) + 1 });
            }
            if (incOrDec == "decrease") {
                this.update(kanbanUUID, { totalIssue: (kanbanData.totalIssue as number) - 1 });
            }
        }
        if (type == "doneIssue") {
            if (incOrDec == "increase") {
                this.update(kanbanUUID, { doneIssue: (kanbanData.doneIssue as number) + 1 });
            }
            if (incOrDec == "decrease") {
                this.update(kanbanUUID, { doneIssue: (kanbanData.doneIssue as number) - 1 });
            }
        }
    }

    static increase() {}

    static get(options: Partial<TkanbanData>) {
        if (!fs.existsSync(this.getKanbanPath())) {
            fs.mkdirSync(this.getKanbanPath(), { recursive: true });
        }

        const kanbanList: TkanbanData[] = [];
        fs.readdirSync(this.getKanbanPath())
            .filter((kanban) => {
                const kanbanData = kanban !== "milestoneListInfo.json" ? this.getKanbanInfo(kanban) : undefined;
                return (
                    kanban !== "milestoneListInfo.json" &&
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

    static create(kanbanData: TkanbanCreateData) {
        const kanbanUUID = uuidv4();
        fs.mkdirSync(this.getKanbanPath(kanbanUUID), { recursive: true });

        if (!this.setKanbanInfo(kanbanUUID, { uuid: kanbanUUID, columns: ["backlog", "todo", "in progress", "Done"], totalIssue: 0, doneIssue: 0, ...kanbanData })) {
            log.error(`[DataKanbanManager] create -> fail to setKanbanInfo`);
            return undefined;
        }
        setJsonData(`${this.getKanbanPath(kanbanUUID)}/issueList.json`, {});
        log.info(`kanbandata created: ${kanbanUUID}`);
        return kanbanUUID;
    }

    static update(kanbanUUID: string, kanbanData: Partial<TkanbanData>) {
        if (!isExists(this.getKanbanPath(kanbanUUID))) {
            log.error(`[DataKanbanManager] update -> could not find kanbanPath`);
            return false;
        }
        if (!this.setKanbanInfo(kanbanUUID, { ...this.getKanbanInfo(kanbanUUID), ...kanbanData } as TkanbanData)) {
            log.error(`[DataKanbanManager] update -> could not setKanbanInfo`);
            return false;
        }
        log.info(`kanbandata updated: ${JSON.stringify(kanbanData)}`);
        return true;
    }
    static delete(kanbanUUID: string) {
        fs.rmdirSync(this.getKanbanPath(kanbanUUID), { recursive: true });
        return true;
    }
}
