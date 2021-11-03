import { DataDirectoryPath, WorkDirectoryPath } from "../../../types/module/data/data.types";
import { TNoteData } from "../../../types/module/data/service/notespace/note.types";
import { getJsonData, isExists, readFromFile, setJsonData, writeToFile } from "../etc/fileManager";
import fs from "fs";
import { AutoMergeSystem } from "../../merge";
import { TReadyQueueItem } from "../../../types/module/data/service/etc/merge.types";
import path from "path";
import log from "../../log";
import { ResponseCode } from "../../../constants/response";
import { getTime } from "../../datetime";
import DataAlarmManager from "../alarm/alarmManager";
import DataUserManager from "../user/userManager";

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
        const notePath = this.isIoFile(noteId) ? noteId : `${noteId}.txt`;
        return readFromFile(defaultPath, notePath);
    }

    static isIoFile(noteId: string) {
        return path.extname(noteId) === ".io" ? true : false;
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

    static create(userId: string, data: TNoteData) {
        const originData = this.get();
        const noteId = data.path;
        const noteIndex = originData.findIndex((noteData: TNoteData) => {
            return noteData.noteId === noteId;
        });
        if (noteIndex > -1) {
            return { code: ResponseCode.confilct, message: "Same note file exists" };
        }

        const defaultPath = this.getNoteWorkPath();
        const notePath = path.join(defaultPath, noteId) as string;
        const dirPath = path.dirname(notePath);

        if (!isExists(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        this.isIoFile(noteId) ? fs.openSync(`${notePath}`, "w") : fs.openSync(`${notePath}.txt`, "w");

        data = {
            ...data,
            noteId,
            content: this.getContent(noteId),
            creator: userId,
            createTime: getTime(),
        };

        if (!setJsonData(`${this.getNoteDataPath()}/${noteDataFileName}`, [...originData, data])) {
            return {
                code: ResponseCode.internalError,
                message: "Failed to create note",
            };
        }
        DataAlarmManager.create(userId, {
            type: "notespace",
            location: `/notespace`,
            content: `${userId} create ${path.basename(data.path)} at notespace`,
            checkAlarm: DataUserManager.getUserList().reduce((list: { [ket in string]: boolean }, member) => {
                list[member] = true;
                return list;
            }, {}),
        });
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
            return {
                code: ResponseCode.internalError,
                message: "Failed to merge note",
            };
        }
    }

    static save(noteData: TNoteData) {
        const noteId = noteData.noteId;
        const originData = this.get();
        const targetData = originData.find((v: TNoteData) => v.noteId === noteId);
        if (targetData === undefined) {
            return {
                code: ResponseCode.invaildRequest,
                message: "Could not find note.",
            };
        }
        const path = this.isIoFile(noteId) ? noteId : `${noteId}.txt`;
        if (!writeToFile(this.getNoteWorkPath(), path, noteData.content)) {
            return {
                code: ResponseCode.internalError,
                message: "Failed to save note",
            };
        }

        return { code: ResponseCode.ok };
    }

    static update(noteId: string, newNotePath: string) {
        const originData = this.get();
        const targetData = originData.find((v: TNoteData) => v.noteId === noteId);

        if (targetData === undefined) {
            return {
                code: ResponseCode.invaildRequest,
                message: "Could not find note.",
            };
        }
        const oldPath = path.join(this.getNoteWorkPath(), `${targetData.path}.txt`);
        const newPath = path.join(this.getNoteWorkPath(), `${newNotePath}.txt`);
        try {
            const newDirPath = path.dirname(newPath);
            if (!isExists(newDirPath)) {
                fs.mkdirSync(newDirPath, { recursive: true });
            }
            fs.renameSync(oldPath, newPath);
        } catch (err) {
            log.error(err);
            return {
                code: ResponseCode.internalError,
                message: "Failed to move data",
            };
        }

        targetData.path = newNotePath;
        targetData.noteId = newNotePath;

        if (setJsonData(`${this.getNoteDataPath()}/${noteDataFileName}`, originData)) {
            return {
                code: ResponseCode.internalError,
                message: "Failed to move note",
            };
        }
        return { code: ResponseCode.ok };
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
        this.isIoFile(notePath) ? fs.unlinkSync(notePath) : fs.unlinkSync(`${notePath}.txt`);
        if (isExists(notePath) && fs.lstatSync(notePath).isDirectory()) {
            fs.rmdirSync(notePath, { recursive: true });
        }
        const childNotes = originData.filter((v) => v.noteId.includes(noteId));
        childNotes?.map((v) => {
            const childIndex = originData.findIndex((note) => note.noteId === noteId);
            if (targetIndex > -1) {
                originData.splice(childIndex, 1);
            }
        });

        if (setJsonData(`${this.getNoteDataPath()}/${noteDataFileName}`, originData)) {
            return {
                code: ResponseCode.internalError,
                message: "Failed to delete note",
            };
        }

        return { code: ResponseCode.ok };
    }
}
