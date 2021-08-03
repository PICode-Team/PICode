import { TSocketPacket } from "../../types/module/socket.types";
import DataChatManager from "../data/chatManager";
import { getSocket, makePacket } from "./manager";

function sendMessage(sender: string, target: string, message: string) {
    const sendData = JSON.stringify(
        makePacket("chat", "sendMessage", { message, sender })
    );
    DataChatManager.saveChat(sender, target, message);

    if (sender !== target) {
        getSocket(sender)?.send(sendData);
    }

    getSocket(target)?.send(sendData);
}

function createChannel(creator: string, chatName: string, data: {}) {
    console.log(data);
    DataChatManager.createChannel({
        userId: creator,
        chatName,
        description: "",
        chatParticipant: [creator],
    });
}

function getChat(userId: string) {
    const sendData = JSON.stringify(
        makePacket("chat", "getChat", DataChatManager.getChat(userId))
    );
    getSocket(userId).send(sendData);
}

function getChatLog(userId: string, chatName: string, page: string) {
    const sendData = JSON.stringify(
        makePacket(
            "chat",
            "getChatLog",
            DataChatManager.getChatLog(userId, chatName, page)
        )
    );
    getSocket(userId).send(sendData);
}

function getChatLogList(userId: string, chatName: string) {
    const sendData = JSON.stringify(
        makePacket(
            "chat",
            "getChatLogList",
            DataChatManager.getChatLogList(userId, chatName)
        )
    );
    getSocket(userId).send(sendData);
}

export default function chat(userId: string, packet: TSocketPacket) {
    switch (packet.type) {
        case "sendMessage": {
            sendMessage(userId, packet.data.target, packet.data.msg);
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
            getChatLogList(userId, packet.data.taret);
            break;
        }
    }
}
