import { TReturnData } from "./data.types";

export type TIssueListJsonData = {
    [key in string]: TIssueListData;
};

export interface TIssueUpdateData {
    title: string;
    creator: string;
    assigner: string;
    label?: string;
    column?: string;
}

export type TIssueListData = TIssueUpdateData & {
    uuid: string;
    issueId: number;
    content?: string;
};

export type TIssueData = TIssueListData & {
    kanban: string;
    milestone?: string;
};

export type TReturnIssueData = TReturnData & {
    uuid?: string;
};
