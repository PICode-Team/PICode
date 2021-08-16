export type TkanbanData = {
    uuid: string;
    title: string;
    column?: string;
    columns?: string[];
    projectName: string;
    milestone?: string;
    totalIssue?: number;
    doneIssue?: number;
};

export type TkanbanCreateData = Pick<TkanbanData, "columns" | "projectName" | "title"> & Pick<Partial<TkanbanData>, "uuid" | "milestone">;
