import { TUploadFileLanguageToSize, TUploadManager } from "./file.types";

export interface TprojectCreateData {
    projectName: string;
    projectDescription?: string;
    projectThumbnail?: string; // move to ./image/uuid, proejectInfo.json
    projectCreator?: string;
    projectParticipants?: string[];
}

export type TProjectUpdateData = TprojectCreateData & {
    projectLanguage?: TUploadFileLanguageToSize;
};

export type TProjectData = TProjectUpdateData & {
    projectId: string;
};
