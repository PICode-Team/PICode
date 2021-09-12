import { DataDirectoryPath } from "../../types/module/data/data.types";
import fs from "fs";
import { TChatChannelData, TChatLogData, TChatLogDataParam, TChatType } from "../../types/module/data/chat.types";
import { getJsonData, setJsonData } from "./fileManager";
import { getTime } from "../datetime";
import { v4 as uuidv4 } from "uuid";

const ChatQueue: TChatLogDataParam[] = [];

export default class DataChatManager {
    static async run() {
        setInterval(() => {
            const originData = ChatQueue.shift();

            if (originData === undefined) {
                return;
            }
            const time = getTime();
            const parentChatTime = originData.chatId?.split("-")?.slice(0, 3)?.join("-");

            const chatLogFileName = parentChatTime ?? getTime(time, "YY-MM-DD");
            const chatObject = { ...originData, time, threadList: [] } as Required<TChatLogDataParam>;
            const chatDir = `${this.getChatDataPath()}/${this.getDirName(chatObject.sender!, chatObject.chatName!)}/log`;
            const chatLogFilePath = `${chatDir}/${chatLogFileName}`;

            chatObject.chatId = `${chatLogFileName}-${uuidv4()}`;

            if (!fs.existsSync(chatDir)) {
                fs.mkdirSync(chatDir, { recursive: true });
            }

            const chatLogData: TChatLogData[] = (() => {
                const saveObject: TChatLogData = { ...{ ...chatObject, chatName: undefined } };
                if (!fs.existsSync(chatLogFilePath)) {
                    return [saveObject];
                }

                const originChatData = getJsonData(chatLogFilePath) as TChatLogData[];
                if (originData.chatId === undefined) {
                    return [...originChatData, saveObject];
                }

                const parentChat = originChatData.find((v) => v.chatId === originData.chatId);

                if (parentChat === undefined) {
                    return originChatData;
                }
                parentChat.threadList.push(saveObject);
                return originChatData;
            })();

            setJsonData(chatLogFilePath, chatLogData);
        }, 100);
    }

    static getChatDataPath() {
        return `${DataDirectoryPath}/chat`;
    }

    static getChatType(chatName: string): TChatType {
        return chatName[0] === "#" ? "channel" : "direct";
    }

    static isExistsChannel(chatName: string) {
        return fs.existsSync(this.getChatDataPath() + `/${chatName}`);
    }

    static getChat(userId: string, chatName?: string) {
        const chatDefaultPath = this.getChatDataPath();
        const chattingList = fs.readdirSync(chatDefaultPath);

        const nameFilter = (name: string) => {
            if (chatName === undefined) {
                return true;
            }

            const type = this.getChatType(name);

            return (type === "channel" && name === chatName) || (type === "direct" && name === this.getDirectMessageDirName(userId, chatName));
        };

        return chattingList
            .filter((v) => nameFilter(v))
            .map((v) => {
                const recentMessageInfo = this.getRecentMessageInfo(userId, v);
                return { ...(getJsonData(`${this.getChatDataPath()}/${v}/chatInfo.json`) as TChatChannelData), recentMessage: recentMessageInfo?.message, recentTime: recentMessageInfo?.time };
            })
            .filter((v) => v.chatParticipant.indexOf(userId) > -1);
    }

    static getRecentMessageInfo(userId: string, chatName: string) {
        const logList = fs.readdirSync(`${this.getChatDataPath()}/${chatName}/log`);
        if (logList.length === 0) {
            return { message: "", time: "" };
        }

        return this.getChatLog(
            userId,
            chatName,
            logList.reduce((preLog: string, curLog: string) => {
                return preLog > curLog ? preLog : curLog;
            })
        )
            .slice(-1)
            .pop();
    }

    static saveChat(sender: string, chatName: string, message: string, chatId?: string) {
        ChatQueue.push({ sender, chatName, message, chatId });
    }

    static getChatLogList(userId: string, chatName: string) {
        return fs.readdirSync(`${this.getChatDataPath()}/${this.getDirName(userId, chatName)}/log`);
    }

    static getChatLog(userId: string, chatName: string, page: string) {
        const dataPath = `${this.getChatDataPath()}/${this.getDirName(userId, chatName)}/log/${page}`;

        if (!fs.existsSync(dataPath)) {
            return [];
        }
        return getJsonData(dataPath) as TChatLogData[];
    }

    static getDirName(userId: string, chatName: string) {
        return this.getChatType(chatName) === "channel" ? chatName : this.getDirectMessageDirName(userId, chatName);
    }

    static getDirectMessageDirName(userId1: string, userId2: string) {
        return [`@${userId1}`, userId2].sort().join("{sep}");
    }

    static createChannel(channelData: TChatChannelData) {
        if (this.isExistsChannel(channelData.chatName)) {
            return false;
        }

        const result = setJsonData(`${this.getChatDataPath()}/${this.getDirName(channelData.userId, channelData.chatName)}/chatInfo.json`, { ...channelData, creation: getTime() });

        if (result) {
            fs.mkdirSync(`${this.getChatDataPath()}/${this.getDirName(channelData.userId, channelData.chatName)}/log`, { recursive: true });
        }

        return result;
    }
}
