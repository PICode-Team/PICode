import { TSocketCategory, TSocketInfo, TSocketPacket } from "../../types/module/socket.types";
import { TUserWorkInfo } from "../../types/module/data/work.types";

export const SocketInfo: TSocketInfo = {};
export const userWorkInfo: TUserWorkInfo = {};

export function getUserWork(userId: string) {
    return userWorkInfo[userId];
}

export function getSocket(userId: string) {
    return SocketInfo[userId];
}

export function makePacket(category: TSocketCategory, type: string, data: any): TSocketPacket {
    return {
        category,
        type,
        data,
    };
}
