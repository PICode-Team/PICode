export interface TReadyQueueItem {
    path: string;
    content: TUpdateContentItem[];
    userId?: string;
}

export interface TUpdateContentItem {
    startRow: number;
    endRow: number;
    startCol: number;
    endCol: number;
    data: string;

    rowInfo: {
        lineNumber: number;
        isUpdate: boolean;
    };
}

export interface TMemoryReadItem {
    readId: string;
    data: any;
    rowInfo: Record<string, number>;
}
