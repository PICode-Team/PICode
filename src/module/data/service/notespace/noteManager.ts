import { DataDirectoryPath } from "../../../../types/module/data/data.types";
import { GQLNote } from "../../../../types/module/data/service/notespace/note.types";
import { getJsonData, isExists, setJsonData } from "../etc/fileManager";
import fs from "fs";
import { AutoMergeSystem } from "../../../merge";
import log from "../../../log";

const noteDataFileName = "noteData.json";

export default class DataNoteManager {
    static noteMergeManager: AutoMergeSystem;
    static run() {
        if (!isExists(this.getNoteDataPath())) {
            fs.mkdirSync(this.getNoteDataPath(), { recursive: true });
        }
        this.noteMergeManager = new AutoMergeSystem(this.getNoteDataPath());
    }

    static getNoteDataPath() {
        return `${DataDirectoryPath}/note`;
    }

    static get(noteId?: string) {
        const defaultPath = this.getNoteDataPath();
        const noteDataPath = `${defaultPath}/${noteDataFileName}`;
        if (!isExists(defaultPath)) {
            fs.mkdirSync(defaultPath, { recursive: true });
        }

        if (!isExists(noteDataPath)) {
            return [];
        }
        return ((getJsonData(`${this.getNoteDataPath()}/${noteDataFileName}`) ?? []) as GQLNote[]).filter((v: GQLNote) => noteId === undefined || v.noteId === noteId);
    }

    static create(data: GQLNote) {
        const originData = this.get();

        return setJsonData(`${this.getNoteDataPath()}/${noteDataFileName}`, [...originData, data]);
    }

    static update(noteId: string, newData: TDataNoteUpdataSet) {
        const originData = this.get();
        const targetData = originData.find((v: GQLNote) => v.noteId === noteId);

        if (targetData === undefined) {
            return false;
        }

        for (const key of (Object.keys(newData) as (keyof TDataNoteUpdataSet)[]).filter((v) => newData[v] !== undefined)) {
            targetData[key] = newData[key];
        }

        return setJsonData(`${this.getNoteDataPath()}/${noteDataFileName}`, originData);
    }

    static delete(noteId: string) {
        const originData = this.get();

        const targetIndex = originData.findIndex((v: GQLNote) => v.noteId === noteId);

        if (targetIndex < 0) {
            return false;
        }

        originData.splice(targetIndex, 1);

        return setJsonData(`${this.getNoteDataPath()}/${noteDataFileName}`, originData);
    }
}

interface TDataNoteUpdataSet {
    content?: string;
    path?: string;
}
