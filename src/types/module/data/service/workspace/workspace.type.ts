import { TReturnData } from "../../data.types";
import { TUploadFileLanguageToSize } from "../etc/file.types";

export interface TWorkspaceCreateData {
    name: string;
    description?: string;
    thumbnail?: string;
    creator?: string;
    participants?: string[];
}

export type TWorkspaceUpdateData = TWorkspaceCreateData & {
    language?: TUploadFileLanguageToSize;
};

export type TWorkspaceData = TWorkspaceUpdateData & {
    workspaceId: string;
    creation: string;
};

export type TReturnWorkspaceData = TReturnData & {
    workspaceId?: string;
};
