import { TSocketPacket } from "../../types/module/socket.types";
import DataUserManager from "../data/userManager";
import { getSocket, makePacket } from "./manager";


export default function user(userId: string, packet: TSocketPacket) {
    switch (packet.type) {
        case 'getUserList': {
            getSocket(userId)?.send(JSON.stringify(makePacket('user', 'getUserList', DataUserManager.getUserList())))
            break
        }
    }
}