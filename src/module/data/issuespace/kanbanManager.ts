import { DataDirectoryPath } from "../../../types/module/data/data.types";
import { TkanbanCreateData, TkanbanData, TReturnKanbanData } from "../../../types/module/data/service/issuespace/kanban.types";
import { getJsonData, isExists, setJsonData } from "../etc/fileManager";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import log from "../../log";
import DataWorkspaceManager from "../workspace/workspaceManager";
import DataAlarmManager from "../alarm/alarmManager";
import { ResponseCode } from "../../../constants/response";

const kanbanInfoFileName = "kanbanInfo.json";

export default class DataKanbanManager {
    static getKanbanPath(kanbanUUID?: string) {
        return kanbanUUID ? `${DataDirectoryPath}/issues/${kanbanUUID}` : `${DataDirectoryPath}/issues`;
    }

    static getKanbanInfo(kanbanUUID: string) {
        const defaultPath = this.getKanbanPath(kanbanUUID);
        const kanbanInfoPath = `${defaultPath}/${kanbanInfoFileName}`;
        if (!isExists(kanbanInfoPath)) {
            return undefined;
        }
        return getJsonData(kanbanInfoPath) as TkanbanData;
    }

    static setKanbanInfo(kanbanUUID: string, kanbanData: TkanbanData) {
        const defaultPath = this.getKanbanPath(kanbanUUID);
        const kanbanInfoPath = `${defaultPath}/${kanbanInfoFileName}`;
        if (!isExists(defaultPath)) {
            return false;
        }

        return setJsonData(kanbanInfoPath, kanbanData);
    }

    static updateIssueCount(kanbanUUID: string, type: "totalIssue" | "doneIssue", incOrDec: "increase" | "decrease") {
        const kanbanData = this.getKanbanInfo(kanbanUUID) as TkanbanData;

        if (type == "totalIssue") {
            if (incOrDec == "increase") {
                this.update(kanbanUUID, {
                    totalIssue: (kanbanData.totalIssue as number) + 1,
                });
            }
            if (incOrDec == "decrease") {
                this.update(kanbanUUID, {
                    totalIssue: (kanbanData.totalIssue as number) - 1,
                });
            }
        }
        if (type == "doneIssue") {
            if (incOrDec == "increase") {
                this.update(kanbanUUID, {
                    doneIssue: (kanbanData.doneIssue as number) + 1,
                });
            }
            if (incOrDec == "decrease") {
                this.update(kanbanUUID, {
                    doneIssue: (kanbanData.doneIssue as number) - 1,
                });
            }
        }
    }

    static get(options: Partial<TkanbanData>) {
        if (!fs.existsSync(this.getKanbanPath())) {
            fs.mkdirSync(this.getKanbanPath(), { recursive: true });
        }

        return fs
            .readdirSync(this.getKanbanPath())
            .filter((kanban) => {
                const kanbanData = kanban !== "milestoneListInfo.json" ? this.getKanbanInfo(kanban) : undefined;
                return (
                    kanban !== "milestoneListInfo.json" &&
                    (options.uuid === undefined || options.uuid === kanbanData?.uuid) &&
                    (options.column === undefined || (options.column as string) in (kanbanData?.columns as string[])) &&
                    (options.workspaceId === undefined || options.workspaceId === kanbanData?.workspaceId) &&
                    (options.title === undefined || options.title === kanbanData?.title)
                );
            })
            .reduce((kanbanList: TkanbanData[], kanban: string) => {
                kanbanList.push(this.getKanbanInfo(kanban) as TkanbanData);
                return kanbanList;
            }, []);
    }

    static create(userId: string, kanbanData: TkanbanCreateData): TReturnKanbanData {
        const kanbanUUID = uuidv4();
        fs.mkdirSync(this.getKanbanPath(kanbanUUID), { recursive: true });

        if (!fs.readdirSync(DataWorkspaceManager.getWorkspaceDefaultPath()).includes(kanbanData.workspaceId)) {
            log.error(`[DataKanbanManager] create -> could not find workspaceId`);
            return { code: ResponseCode.invaildRequest, message: "Could not find workspace" };
        }

        if (
            !this.setKanbanInfo(kanbanUUID, {
                uuid: kanbanUUID,
                columns: ["backlog", "todo", "in progress", "Done"],
                totalIssue: 0,
                doneIssue: 0,
                nextIssue: 0,
                ...kanbanData,
            })
        ) {
            log.error(`[DataKanbanManager] create -> fail to setKanbanInfo`);
            return { code: ResponseCode.internalError, message: "Failed to create kanban" };
        }
        setJsonData(`${this.getKanbanPath(kanbanUUID)}/issueList.json`, {});
        log.info(`kanbandata created: ${kanbanUUID}`);
        DataAlarmManager.create(userId, {
            type: "issuespace",
            location: `/issuespace?type=Kanban`,
            content: `${userId} create ${kanbanData.title} kanban at ${kanbanData.workspaceId}`,
            checkAlarm: (DataWorkspaceManager.getWorkspaceInfo(kanbanData.workspaceId)?.participants as string[]).reduce(
                (list: { [ket in string]: boolean }, member) => {
                    list[member] = true;
                    return list;
                },
                {}
            ),
        });
        return { code: ResponseCode.ok, uuid: kanbanUUID };
    }

    static update(kanbanUUID: string, kanbanData: Partial<TkanbanData>, userId: string = ""): TReturnKanbanData {
        if (!isExists(this.getKanbanPath(kanbanUUID))) {
            log.error(`[DataKanbanManager] update -> could not find kanbanPath`);
            return { code: ResponseCode.invaildRequest, message: "Could not find kanban" };
        }
        const updateKanbanData = {
            ...this.getKanbanInfo(kanbanUUID),
            ...kanbanData,
        };
        if (!this.setKanbanInfo(kanbanUUID, updateKanbanData as TkanbanData)) {
            log.error(`[DataKanbanManager] update -> could not setKanbanInfo`);
            return { code: ResponseCode.internalError, message: "Failed to update kanban" };
        }
        log.info(`kanbandata updated: ${JSON.stringify(updateKanbanData)}`);
        if (userId !== "") {
            DataAlarmManager.create(userId, {
                type: "issuespace",
                location: `/issuespace?type=Kanban`,
                content: `${userId} update ${kanbanData.title ?? this.getKanbanInfo(kanbanUUID)?.title} kanban at ${
                    kanbanData.workspaceId
                }`,
                checkAlarm: (
                    DataWorkspaceManager.getWorkspaceInfo(kanbanData.workspaceId ?? (updateKanbanData.workspaceId as string))
                        ?.participants as string[]
                ).reduce((list: { [ket in string]: boolean }, member) => {
                    list[member] = true;
                    return list;
                }, {}),
            });
        }
        return { code: ResponseCode.ok };
    }

    static delete(userId: string, kanbanUUID: string): TReturnKanbanData {
        if (kanbanUUID === undefined || !fs.readdirSync(this.getKanbanPath()).includes(kanbanUUID)) {
            log.error(`[DataKanbanManager] delete -> kanban uuid is not in kanbanList`);
            return { code: ResponseCode.invaildRequest, message: "Invaild kanbanUUID" };
        }
        const kanbanData = this.getKanbanInfo(kanbanUUID) as TkanbanData;
        fs.rmdirSync(this.getKanbanPath(kanbanUUID), { recursive: true });
        log.info(`kanbandata deleted: kanbanUUID: ${kanbanUUID}`);
        DataAlarmManager.create(userId, {
            type: "issuespace",
            location: `/issuespace?type=Kanban`,
            content: `${userId} delete ${kanbanData.title} kanban at ${kanbanData.workspaceId}`,
            checkAlarm: (DataWorkspaceManager.getWorkspaceInfo(kanbanData.workspaceId)?.participants as string[]).reduce(
                (list: { [ket in string]: boolean }, member) => {
                    list[member] = true;
                    return list;
                },
                {}
            ),
        });
        return { code: ResponseCode.ok };
    }
}
