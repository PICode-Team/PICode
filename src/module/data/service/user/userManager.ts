import { DataDirectoryPath, StaticDirectoryPath, UploadDirectoryPath } from "../../../../types/module/data/data.types";
import { TUserData } from "../../../../types/module/data/service/user/user.types";
import { getJsonData, handle, isExists, removeData, setJsonData } from "../etc/fileManager";
import { readdirSync } from "fs";
import DataUploadManager from "../etc/uploadManager";
import path from "path";
import fs from "fs";

export default class DataUserManager {
    static getUserDataPath(userId: string, type: "" | "userInfo.json" = "") {
        return `${DataDirectoryPath}/user/${userId}/${type}`;
    }

    static isExists(userId: string) {
        return isExists(this.getUserDataPath(userId));
    }

    static get(userId: string) {
        if (!this.isExists(userId)) {
            return undefined;
        }

        return getJsonData(this.getUserDataPath(userId, "userInfo.json")) as TUserData;
    }

    static getList(userId: string, queryUser?: string) {
        return fs
            .readdirSync(`${DataDirectoryPath}/user`)
            .filter((user) => {
                return (queryUser === undefined || user === queryUser) && userId !== user;
            })
            .map((user) => {
                return { ...(getJsonData(this.getUserDataPath(user, "userInfo.json")) as TUserData), passwd: undefined };
            });
    }

    static getUserList() {
        return readdirSync(`${DataDirectoryPath}/user`, { withFileTypes: true })
            .filter((v) => v.isDirectory())
            .map((v) => v.name);
    }

    static create(userInfo: TUserData) {
        DataUploadManager.loadUploadFileInfo();
        const userId = userInfo?.userId;
        if (this.isExists(userId)) {
            return false;
        }
        if (userInfo.userThumbnail !== undefined) {
            if (!fs.existsSync(StaticDirectoryPath)) {
                fs.mkdirSync(StaticDirectoryPath, {
                    recursive: true,
                });
            }
            const extension = DataUploadManager.UploadFileManager[userInfo.userThumbnail].originalname.split(".").pop();
            if (!handle(`${UploadDirectoryPath}/${userInfo.userThumbnail}`, `${StaticDirectoryPath}/${userInfo.userThumbnail}.${extension}`)) {
                return false;
            }
            DataUploadManager.deleteUploadFileInfo(userInfo.userThumbnail);
            userInfo.userThumbnail = `${userInfo.userThumbnail}.${extension}`;
        }
        return setJsonData(this.getUserDataPath(userId, "userInfo.json"), userInfo);
    }

    static update(userInfo: TUserData) {
        DataUploadManager.loadUploadFileInfo();
        const userId = userInfo?.userId;
        if (!this.isExists(userId)) {
            return false;
        }
        const userData = this.get(userId);
        if (userData === undefined) {
            return false;
        }

        if (userInfo.userThumbnail !== undefined && path.parse(userData.userThumbnail as string).name !== userInfo.userThumbnail) {
            const extension = DataUploadManager.UploadFileManager[userInfo.userThumbnail].originalname.split(".").pop();
            if (!handle(`${UploadDirectoryPath}/${userInfo.userThumbnail}`, `${StaticDirectoryPath}/${userInfo.userThumbnail}.${extension}`)) {
                return false;
            }
            if (userData.userThumbnail !== undefined) {
                fs.unlinkSync(`${StaticDirectoryPath}/${userData.userThumbnail}`);
            }
            DataUploadManager.deleteUploadFileInfo(userInfo.userThumbnail);
            userInfo.userThumbnail = `${userInfo.userThumbnail}.${extension}`;
        }

        return setJsonData(this.getUserDataPath(userId, "userInfo.json"), { ...userData, ...userInfo });
    }

    static delete(userId: string) {
        if (!this.isExists(userId)) {
            return false;
        }

        return removeData(this.getUserDataPath(userId));
    }
}
