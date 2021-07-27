import { TSocketInfo, TUserWorkInfo } from "../../types/module/socket.types";

export const SocketInfo: TSocketInfo = {};
export const userWorkInfo: TUserWorkInfo = {};

export function getUserWork(userId: string) {
    return userWorkInfo[userId];
}

export function getSocket(userId: string) {
    return SocketInfo[userId];
}

export function makePacket(category: string, type: string, data: any) {
    return {
        category,
        type,
        data,
    };
}
