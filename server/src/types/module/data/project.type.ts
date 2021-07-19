import { TUploadFileLanguageToSize } from "./file.types";

export interface TprojectCreateData {
    projectName: string;
    projectDescription?: string;
    projectThumbnail?: string; //./image/uuid로 위치이동하기, proejectInfo.json
}

export type TProjectUpdateData = TprojectCreateData & {
    projectLanguage?: TUploadFileLanguageToSize;
};

export type TProjectData = TProjectUpdateData & {
    projectId: number;
};
