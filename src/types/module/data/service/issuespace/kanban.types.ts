import { TReturnData } from "../../data.types";

export type TkanbanCreateData = {
    title: string;
    workspaceId: string;
    columns?: string[];
};

export type TkanbanData = TkanbanCreateData & {
    uuid: string;
    column?: string;
    totalIssue?: number;
    doneIssue?: number;
    nextIssue?: number;
};

export type TReturnKanbanData = TReturnData & {
    uuid?: string;
};
