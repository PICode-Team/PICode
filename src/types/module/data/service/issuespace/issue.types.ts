import { TReturnData } from "../../data.types";

export type TIssueListJsonData = Record<string, TIssueListData>;

export interface TIssueUpdateData {
    title: string;
    creator: string;
    assigner: string;
    label?: string;
    column?: string;
    startDate?: string;
    dueDate?: string;
}

export type TIssueListData = TIssueUpdateData & {
    uuid: string;
    issueId: number;
    content?: string;
};

export type TIssueData = TIssueListData & {
    kanban: string;
    milestone?: string;
    creation?: string;
};

export type TReturnIssueData = TReturnData & {
    issue?: TIssueData;
};
