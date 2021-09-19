export type TkanbanCreateData = {
    title: string;
    workspaceName: string;
    columns?: string[];
};

export type TkanbanData = TkanbanCreateData & {
    uuid: string;
    column?: string;
    totalIssue?: number;
    doneIssue?: number;
    nextIssue?: number;
};
