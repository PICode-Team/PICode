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

        let orgContent = this.memoryDisk.read(path) as string;
        const updContent = item.content;

        orgContent = typeof orgContent === 'number' ? '' : orgContent;

        for (const updateItem of updContent) {
            const strIndex = this.findIndex(orgContent, updateItem);
            console.log(orgContent, updateItem);
            orgContent = this.strReplace(orgContent, strIndex.start, strIndex.end, updateItem.data);
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

    private findIndex(str: string, update: TUpdateContentItem) {
        const result = { start: -1, end: -1}

        const length = str.length
    
        let row = 1;
    
        for (let i = 0; i < length; i++) {
            if (str[i] === '\n') {
                row += 1;
            }
    
            if (update.startRow === row) {
                result.start = i + update.startCol
            } 
            
            if (update.endRow === row){
                result.end = i + update.endCol
                break;
            }
        }
    
        return result; 
    }

    private strReplace(str: string, start: number, end: number, replace: string) {
        return str.substring(0, start) + replace + str.substring(end);
    }
}

export interface TReadyQueueItem {
    path: string;
    content: TUpdateContentItem[];
}

export interface TUpdateContentItem {
    startRow: number;
    endRow: number;
    startCol: number;
    endCol: number;
    data: string;
}

interface TDataHistory {
    orgContent: string;
    history: {
        readId: string;
        content: TUpdateContentItem[];
    }[];
}
