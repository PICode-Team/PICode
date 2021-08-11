import { DataDirectoryPath } from "../../types/module/data/data.types";
import { TUserData } from "../../types/module/data/user.types";
import { getJsonData, isExists, removeData, setJsonData } from "./fileManager";
import { readdirSync } from "fs";

export default class DataUserManager {
    static getUserDataPath(userId: string, type: '' | 'userInfo.json' = '') {
        return `${DataDirectoryPath}/user/${userId}/${type}`
    }

    static isExists(userId: string) {
        return isExists(this.getUserDataPath(userId))
    }

    static get(userId: string) {
        if (!this.isExists(userId)) {
            return undefined
        }

        return getJsonData(
            this.getUserDataPath(userId, 'userInfo.json')
        ) as TUserData
    }

    static getUserList() {
        return readdirSync(`${DataDirectoryPath}/user`, {withFileTypes: true}).filter(v=>v.isDirectory()).map(v=>v.name)
    }

    static create(userInfo: TUserData) {
        const userId = userInfo?.userId
        if (this.isExists(userId)) {
            return false
        }

        return setJsonData(this.getUserDataPath(userId, 'userInfo.json'), userInfo)
    }

    static update(userInfo: TUserData) {
        const userId = userInfo?.userId
        if (!this.isExists(userId)) {
            return false
        }
        const userData = this.get(userId)

        return setJsonData(this.getUserDataPath(userId, 'userInfo.json'), { ...userData, ...userInfo })
    }

    static delete(userId: string) {
        if (!this.isExists(userId)) {
            return false
        }

        return removeData(this.getUserDataPath(userId))
    }
}