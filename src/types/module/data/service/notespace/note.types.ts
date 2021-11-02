import { TMemoryReadItem } from "../etc/merge.types";

export interface TNoteData {
    noteId?: string;
    path?: string;
    creator?: string;
    createTime?: string;
    content?: string | TMemoryReadItem;
}
