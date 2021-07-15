import { TSocketPacket } from "../../types/module/socket.types";
import { getSocket, makePacket } from "./manager";


function sendMessage(sender: string, target: string, message: string) {
    const sendData = JSON.stringify(makePacket('chat', 'sendMessage', { message, sender }))

    if (sender !== target) {
        getSocket(sender)?.send(sendData)
    }

    getSocket(target)?.send(sendData)
}

// function createChannel(creator: string, channelName: string, data: {}) {

// }



export default function chat(userId: string, packet: TSocketPacket) {

    switch (packet.type) {
        case 'sendMessage': {
            sendMessage(userId, packet.data.target, packet.data.msg)
            break
        }
        case 'createChannel': {
            break
        }
    }
}