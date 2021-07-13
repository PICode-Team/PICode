export interface TProjectUpdateData {
    projectName: string;
    projectDescription?: string;
    projectLanguage?: string;
    projectThumbnail?: string;
}

export type TProjectData = TProjectUpdateData & {
    projectId: number;
};
