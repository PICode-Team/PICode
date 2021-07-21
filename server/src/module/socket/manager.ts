import { TSocketInfo } from "../../types/module/socket.types";

export const SocketInfo: TSocketInfo = {}

export function getSocket(userId: string) {
    return SocketInfo[userId]
}


export function makePacket(category: string, type: string, data: any) {
    return {
        category, type, data
    }
}