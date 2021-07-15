import { DataDirectoryPath } from "../../types/module/data/data.types";
import fs from 'fs'
import { TChatChannelData, TChatType } from "../../types/module/data/chat.types";
import { getJsonData, setJsonData } from "./fileManager";


export default class DataChatManager {
    static getChatDataPath({ type, chatName, fileName, userId }: { chatName?: string, type?: TChatType, fileName?: 'channelInfo.json', userId?: string } = {}) {
        return type === undefined ? `${DataDirectoryPath}/chat` : type === 'channel' ? `${DataDirectoryPath}/chat/#${chatName}/${fileName}` : `${DataDirectoryPath}/chat/${userId}/${chatName}/${fileName}`
    }

    static getChatType(chatName: string): TChatType {
        return chatName[0] === '#' ? 'channel' : 'direct'
    }


    static isExistsChannel(chatName: string) {
        return fs.existsSync(this.getChatDataPath() + `/${chatName}`)
    }

    static getChat(userId: string, chatName?: string) {
        const directMessageList = fs.readdirSync(this.getChatDataPath() + `/${userId}`)
        const channelMessageList = fs.readdirSync(this.getChatDataPath()).filter(v => this.getChatType(v) === 'channel').filter(v => {
            const channelInfoData = getJsonData(this.getChatDataPath({ type: 'channel', fileName: 'channelInfo.json', chatName: v })) as TChatChannelData
            return channelInfoData.chatParticipant.indexOf(userId) > -1
        }).map(v => `#${v}`)

        return [...directMessageList, ...channelMessageList].filter(v => chatName === undefined || v === chatName)
    }

    // static getChatContent(userId: string, chatName: string) {

    // }

    static createChannel(channelData: TChatChannelData) {
        if (this.isExistsChannel(channelData.channelName)) {
            return false
        }

        return setJsonData(this.getChatDataPath({ chatName: channelData.channelName, type: 'channel', fileName: 'channelInfo.json' }), channelData)
    }
}
