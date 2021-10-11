import { MemoryDisk } from "memory-disk";
import { v4 } from "uuid";

/**
 * @description It is an auto-merge object. It is an object for simultaneous editing, and data is managed in memory and on disk.
 */

export class AutoMergeSystem {
    private readonly memoryDisk: MemoryDisk;
    private readonly readyQueue: TReadyQueueItem[];
    private readonly dataHistoryObject: Record<string, TDataHistory>;

    constructor(path?: string) {
        this.memoryDisk = new MemoryDisk(path, true);
        this.readyQueue = [];
        this.dataHistoryObject = {};
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

        const orgContent = this.memoryDisk.read(path) as string;
        const updContent = item.content;

        const newLineCharacter = "\r\n";
        const orgDataList = typeof orgContent !== "number" ? orgContent.split(newLineCharacter) : [];

        for (const updateItem of updContent.sort((a, b) => a.line - b.line)) {
            if (orgDataList.length < updateItem.line) {
                orgDataList.push(updateItem.updateContent);
                continue;
            }

            orgDataList[updateItem.line - 1] = updateItem.updateContent;
        }

        this.memoryDisk.write(path, orgDataList.filter((v) => v !== undefined).join(newLineCharacter));
        this.memoryDisk.saveDiskAll();
    }

    /**
     * @private
     * @returns { void } void
     */

    private async run() {
        setInterval(() => {
            this.autoMerge();
        }, 500);
    }

    /**
     * @public
     * @returns
     */
    public read(path: string) {
        const readId = v4();
        const data = this.memoryDisk.read(path);

        if (this.dataHistoryObject[path] === undefined) {
            this.dataHistoryObject[path] = {
                orgContent: data,
                history: [{ readId, content: [] }],
            };
        }

        return { readId, data };
    }

    /**
     * @public
     * @returns
     */
    public update(path: string, content: TUpdateContentItem[]) {
        this.readyQueue.push({ path, content });
    }
}

export interface TReadyQueueItem {
    path: string;
    content: TUpdateContentItem[];
}

export interface TUpdateContentItem {
    line: number;
    updateContent: string;
}

interface TDataHistory {
    orgContent: string;
    history: {
        readId: string;
        content: TUpdateContentItem[];
    }[];
}
