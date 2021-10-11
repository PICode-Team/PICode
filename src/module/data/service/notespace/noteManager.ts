import { DataDirectoryPath, WorkDirectoryPath } from "../../../../types/module/data/data.types";
import { TNoteData } from "../../../../types/module/data/service/notespace/note.types";
import { getJsonData, isExists, readFromFile, setJsonData } from "../etc/fileManager";
import fs from "fs";
import { AutoMergeSystem, TReadyQueueItem } from "../../../merge";
import path from "path";
import log from "../../../log";
import { ResponseCode } from "../../../../constants/response";

const noteDataFileName = "noteData.json";

export default class DataNoteManager {
    static noteMergeManager: AutoMergeSystem;
    static run() {
        const noteDefaultPath = this.getNoteDataPath();
        if (!isExists(noteDefaultPath)) {
            fs.mkdirSync(noteDefaultPath, { recursive: true });
        }
        this.noteMergeManager = new AutoMergeSystem(noteDefaultPath);
    }

    static getNoteDataPath() {
        return `${DataDirectoryPath}/note`;
    }

    static getNoteWorkPath() {
        return `${WorkDirectoryPath}/note`;
    }

    static getContent(noteId?: string) {
        if (noteId === undefined) {
            return "";
        }
        const defaultPath = this.getNoteWorkPath();
        return readFromFile(defaultPath, `${noteId}.txt`);
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
        return ((getJsonData(`${noteDataPath}`) ?? []) as TNoteData[])
            .filter((v: TNoteData) => noteId === undefined || v.noteId === noteId)
            .map((v: TNoteData) => {
                return { ...v, content: this.getContent(v.noteId) };
            });
    }

    static create(data: TNoteData) {
        const originData = this.get();
        const noteId = data.path;

        const defaultPath = this.getNoteWorkPath();
        const notePath = path.join(defaultPath, noteId) as string;
        const dirPath = path.dirname(notePath);
        
        if (!isExists(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        fs.openSync(`${notePath}.txt`, "w");

        data = { ...data, noteId, content: this.getContent(noteId) };

        if (!setJsonData(`${this.getNoteDataPath()}/${noteDataFileName}`, [...originData, data])) {
            return { code: ResponseCode.internalError, message: "Failed to create note" };
        }
        return { code: ResponseCode.ok, noteId };
    }

    static merge(updateContent: TReadyQueueItem) {
        const defaultPath = this.getNoteWorkPath();
        const notePath = path.join(defaultPath, updateContent.path);
        try {
            this.noteMergeManager.update(notePath, updateContent.content);
            return { code: ResponseCode.ok };
        } catch (err) {
            log.error(err);
            return { code: ResponseCode.internalError, message: "Failed to merge note" };
        }
    }

    static update(noteId: string, newNotePath: string) {
        const originData = this.get();
        const targetData = originData.find((v: TNoteData) => v.noteId === noteId);

        if (targetData === undefined) {
            return false;
        }
        const oldPath = path.join(this.getNoteWorkPath(), `${targetData.path}.txt`);
        const newPath = path.join(this.getNoteWorkPath(), `${newNotePath}.txt`);

        log.debug(`oldPath : ${oldPath}, newPath : ${newPath}`);
        try {
            fs.renameSync(oldPath, newPath);
        } catch (err) {
            log.error(err);
            return { code: ResponseCode.internalError, message: "Failed to move data" };
        }

        targetData.path = newPath;
        targetData.noteId = newPath;

        return setJsonData(`${this.getNoteDataPath()}/${noteDataFileName}`, originData);
    }

    static delete(noteId: string) {
        const originData = this.get();

        const targetIndex = originData.findIndex((v: TNoteData) => v.noteId === noteId);

        if (targetIndex < 0) {
            return false;
        }

        originData.splice(targetIndex, 1);

        const defaultPath = this.getNoteWorkPath();
        const notePath = path.join(defaultPath, noteId);
        fs.unlinkSync(notePath);

        return setJsonData(`${this.getNoteDataPath()}/${noteDataFileName}`, originData);
    }
}
