export type TIssueListJsonData = {
    [key in string]: TIssueListData;
};

export interface TIssueUpdateData {
    title?: string;
    creator?: string;
    assigner?: string;
    label?: string;
    column?: string;
}

export type TIssueListData = TIssueUpdateData & {
    uuid?: string;
    issueId: number;
};

export type TIssueData = TIssueListData & {
    content?: string;
    projectName: string;
    kanban: string;
    milestone: string;
};
