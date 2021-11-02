import { TChatChannelData } from "../../../../types/module/data/service/chatspace/chat.types";
import { TSocketPacket } from "../../../../types/module/socket.types";
import DataAlarmManager from "../../../data/alarm/alarmManager";
import DataChatManager from "../../../data/chatspace/chatManager";
import { getTime } from "../../../datetime";
import { getSocket, makePacket } from "../etc/manager";

function sendMessage(sender: string, target: string, { message, parentChatId }: { message: string; parentChatId?: string }) {
    const metaData = { message, sender, parentChatId, time: getTime(), chatName: target };
    const sendData = makePacket("chat", "sendMessage", metaData);
    DataChatManager.saveChat(sender, target, message, parentChatId);

    if (DataChatManager.getChatType(target) === "direct") {
        if (sender !== target) {
            getSocket(sender)?.send(sendData);
        }
        getSocket(target)?.send(makePacket("chat", "sendMessage", { ...metaData, chatName: sender }));
        DataAlarmManager.create(sender, {
            type: "chat",
            location: `/chatspace?target=${sender}`,
            content: `${sender} send message to you : ${message}`,
            checkAlarm: { [target]: true },
        });
    } else {
        const [chatData] = DataChatManager.getChat(sender, target);

        if (chatData !== undefined) {
            chatData.chatParticipant?.forEach((userId) => {
                getSocket(userId)?.send(sendData);
            });
            DataAlarmManager.create(sender, {
                type: "chat",
                location: `/chatspace?target=${target}`,
                content: `${sender} send message to channel ${target}: ${message}`,
                checkAlarm: chatData.chatParticipant.reduce((list: { [ket in string]: boolean }, member) => {
                    list[member] = true;
                    return list;
                }, {}),
            });
        }
    }
}

function createChannel(creator: string, chatName: string, data: { description?: string; chatParticipant?: string[] }) {
    const chatParticipant = data?.chatParticipant === undefined ? [creator] : Array.from(new Set([creator, ...data?.chatParticipant]));
    const createData: TChatChannelData = {
        userId: creator,
        chatName,
        description: data?.description ?? "",
        chatParticipant,
    };

    DataChatManager.createChannel(createData);

    chatParticipant.forEach((userId) => {
        try {
            getSocket(userId)?.send(makePacket("chat", "createChannel", createData));
        } catch {}
    });
    DataAlarmManager.create(creator, {
        type: "chat",
        location: `/chatspace?target=${chatName}`,
        content: `${creator} create channel ${chatName}`,
        checkAlarm: chatParticipant.reduce((list: { [ket in string]: boolean }, member) => {
            list[member] = true;
            return list;
        }, {}),
    });
}

function getChat(userId: string) {
    const sendData = makePacket("chat", "getChat", DataChatManager.getChat(userId));
    getSocket(userId)?.send(sendData);
}

function getChatLog(userId: string, chatName: string, page: string) {
    const sendData = makePacket("chat", "getChatLog", DataChatManager.getChatLog(userId, chatName, page));
    getSocket(userId)?.send(sendData);
}

function getChatLogList(userId: string, chatName: string) {
    const sendData = makePacket("chat", "getChatLogList", DataChatManager.getChatLogList(userId, chatName));
    getSocket(userId)?.send(sendData);
}

export default function chat(userId: string, packet: TSocketPacket) {
    switch (packet.type) {
        case "sendMessage": {
            sendMessage(userId, packet.data.target, packet.data);
            break;
        }
        case "createChannel": {
            createChannel(userId, packet.data.target, packet.data);
            break;
        }
        case "getChat": {
            getChat(userId);
            break;
        }
        case "getChatLog": {
            getChatLog(userId, packet.data.target, packet.data.page);
            break;
        }
        case "getChatLogList": {
            getChatLogList(userId, packet.data.target);
            break;
        }
    }
}
