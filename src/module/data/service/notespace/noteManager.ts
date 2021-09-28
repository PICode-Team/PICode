import { DataDirectoryPath } from "../../../../types/module/data/data.types";
import { GQLNote } from "../../../../types/module/data/service/notespace/note.types";
import { getJsonData, setJsonData } from "../etc/fileManager";

export default class DataNoteManager {
    static getnoteDataPath() {
        return `${DataDirectoryPath}/note`;
    }

    static get(noteId?: string) {
        return ((getJsonData(`${this.getnoteDataPath()}/noteData.json`) ?? []) as GQLNote[]).filter((v: GQLNote) => noteId === undefined || v.noteId === noteId);
    }

    static create(data: GQLNote) {
        const originData = this.get();

        return setJsonData(`${this.getnoteDataPath()}/noteData.json`, [...originData, data]);
    }

    static update(noteId: string, newData: TDatanoteUpdataSet) {
        const originData = this.get();
        const targetData = originData.find((v: GQLNote) => v.noteId === noteId);

        if (targetData === undefined) {
            return false;
        }

        for (const key of (Object.keys(newData) as (keyof TDatanoteUpdataSet)[]).filter((v) => newData[v] !== undefined)) {
            targetData[key] = newData[key];
        }

        return setJsonData(`${this.getnoteDataPath()}/noteData.json`, originData);
    }

    static delete(noteId: string) {
        const originData = this.get();

        const targetIndex = originData.findIndex((v: GQLNote) => v.noteId === noteId);

        if (targetIndex < 0) {
            return false;
        }

        originData.splice(targetIndex, 1);

        return setJsonData(`${this.getnoteDataPath()}/noteData.json`, originData);
    }
}

interface TDatanoteUpdataSet {
    content?: string;
    path?: string;
}
