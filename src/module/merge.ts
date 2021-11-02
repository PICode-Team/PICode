import { MemoryDisk } from "memory-disk";
import { v4 } from "uuid";
import { getTime } from "./datetime";
import { TMemoryReadItem, TReadyQueueItem, TUpdateContentItem } from "../types/module/data/service/etc/merge.types";
/**
 * @description It is an auto-merge object. It is an object for simultaneous editing, and data is managed in memory and on disk.
 */

export class AutoMergeSystem {
    private readonly memoryDisk: MemoryDisk;
    private readonly readyQueue: TReadyQueueItem[];
    private readonly dataHistoryObject: Record<string, TDataHistory>;
    private readonly focusData: Record<string, Record<string, number>>;

    constructor(path?: string) {
        this.memoryDisk = new MemoryDisk(path, true);
        this.readyQueue = [];
        this.dataHistoryObject = {};
        this.focusData = {};
        this.run();
    }

    /**
     * @private
     * @returns { void } void
     */

    private async autoMerge() {
        if (this.readyQueue.length === 0) {
            return;
        }

        const item = this.readyQueue.shift();
        const path = item.path;
        const userId = item.userId;

        let orgContent = this.memoryDisk.read(path) as string;
        const updContent = item.content;

        orgContent = typeof orgContent === "number" ? "" : orgContent.replace(/\r\n/g, "\n");

        if (userId !== undefined) {
            this.focusData[path] = this.focusData[path] ?? {};
        }

        let lineDiff = 0;
        const focusPathData = this.focusData[path];

        for (const updateItem of updContent) {
            if (updateItem.rowInfo.isUpdate) {
                focusPathData[userId] = updateItem.rowInfo.lineNumber;
            }
            lineDiff -= (focusPathData[userId] ?? updateItem.rowInfo.lineNumber) - updateItem.rowInfo.lineNumber;

            console.log(getTime(), updateItem, lineDiff, focusPathData[userId]);
            for (const user in focusPathData) {
                if (user === userId) {
                    continue;
                }

                if (focusPathData[user] > updateItem.endRow) {
                    focusPathData[user] += updateItem.rowInfo.lineNumber - updateItem.endRow;
                    console.log(user, focusPathData[user]);
                }
            }

            updateItem.startRow += lineDiff;
            updateItem.endRow += lineDiff;

            const strIndex = this.findIndex(orgContent, updateItem);
            orgContent = this.strReplace(orgContent, strIndex.start, strIndex.end, updateItem.data.replace(/\r\n/g, "\n"));

            this.memoryDisk.write(path, orgContent);
        }

        this.memoryDisk.saveDiskAll();
    }

    /**
     * @private
     * @returns { void } void
     */

    private async run() {
        setInterval(() => {
            this.autoMerge();
        }, 100);
    }

    /**
     * @public
     * @returns
     */
    public read(path: string): TMemoryReadItem {
        const readId = v4();
        const data = this.memoryDisk.read(path);

        if (this.dataHistoryObject[path] === undefined) {
            this.dataHistoryObject[path] = {
                orgContent: data,
                history: [{ readId, content: [] }],
            };
        }

        return { readId, data, rowInfo: this.focusData?.[path] };
    }

    /**
     * @public
     * @returns
     */
    public update(path: string, content: TUpdateContentItem[], userId?: string) {
        this.readyQueue.push({ path, content, userId });
    }

    private findIndex(str: string, update: TUpdateContentItem) {
        const result = { start: -1, end: -1 };

        const length = str.length;

        let row = 1;

        for (let i = 0; i < length; i++) {
            if (str[i] === "\n") {
                row += 1;
            }

            const logic = update.startRow === 1 && update.startRow === update.endRow;

            if (update.startRow === row && result.start === -1) {
                result.start = i + update.startCol - Number(logic);
            }

            if (update.endRow === row && result.end === -1) {
                result.end = i + update.endCol - Number(logic);
                break;
            }
        }

        if (update.startRow === 1 && update.startCol === 1) {
            result.start = 0;
        }

        return result;
    }

    private strReplace(str: string, start: number, end: number, replace: string) {
        return str.substring(0, start) + replace + str.substring(end);
    }
}

interface TDataHistory {
    orgContent: string;
    history: {
        readId: string;
        content: TUpdateContentItem[];
    }[];
}
