import { TUploadFileLanguageToSize } from "./file.types";

export interface TWorkspaceCreateData {
    name: string;
    description?: string;
    thumbnail?: string; // move to ./image/uuid, proejectInfo.json
    creator?: string;
    participants?: string[];
}

export type TWorkspaceUpdateData = TWorkspaceCreateData & {
    language?: TUploadFileLanguageToSize;
};

export type TWorkspaceData = TWorkspaceUpdateData & {
    workspaceId: string;
};
