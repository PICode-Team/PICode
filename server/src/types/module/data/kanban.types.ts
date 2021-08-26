export type TkanbanCreateData = {
    title: string;
    projectName: string;
    columns?: string[];
};

export type TkanbanData = TkanbanCreateData & {
    uuid: string;
    column?: string;
    totalIssue?: number;
    doneIssue?: number;
    nextIssue?: number;
};
