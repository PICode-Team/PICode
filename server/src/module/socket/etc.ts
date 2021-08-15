import { TSocketPacket } from "../../types/module/socket.types";
import DataUserManager from "../data/userManager";
import { getSocket } from "./manager";

export function sendAllUser(packet: TSocketPacket) {
    for (const user of DataUserManager.getUserList()) {
        getSocket(user)?.send(JSON.stringify(packet))
    }
}