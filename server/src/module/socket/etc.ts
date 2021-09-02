import { TSocketPacket } from "../../types/module/socket.types";
import DataUserManager from "../data/userManager";
import { getSocket } from "./manager";

export function sendAllUserPacket(packet: TSocketPacket, userList: string[] | undefined = undefined) {
    for (const user of userList ?? DataUserManager.getUserList()) {
        getSocket(user)?.send(JSON.stringify(packet))
    }
}
