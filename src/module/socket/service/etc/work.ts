import { TSocketPacket } from "../../../../types/module/socket.types";
import { makePacket, getSocket, userWorkInfo, getUserWork, SocketInfo } from "./manager";
import { TWorkInfo, TUserToWork } from "../../../../types/module/data/service/etc/work.types";
import DataUserManager from "../../../data/user/userManager";
import { ResponseCode } from "../../../../constants/response";

const workLoadFuncs: Record<string, (userId: string, workingPath: any) => void> = {
    createInfo,
    getWorkingPath,
    deleteInfo,
};

function getWorkingPath(userId: string, workInfo: TWorkInfo) {
    userWorkInfo[userId] = workInfo;
    const sendData: TUserToWork[] = [];
    Object.keys(userWorkInfo)
        .filter((userIdElement) => Object.keys(SocketInfo).includes(userIdElement))
        .forEach((userIdElement) => {
            const otherWorkInfo = {
                userId: userIdElement,
                workInfo: getUserWork(userIdElement),
                userThumbnail: DataUserManager.get(userIdElement)?.userThumbnail,
            };
            sendData.push(otherWorkInfo);
        });
    Object.keys(userWorkInfo)
        .filter((userIdElement) => Object.keys(SocketInfo).includes(userIdElement))
        .map((userIdElement) => {
            getSocket(userIdElement).send(makePacket("work", "getWorkingPath", sendData));
        });
}

function createInfo(userId: string, workInfo: TWorkInfo) {
    userWorkInfo[userId] = workInfo;
    const sendData = makePacket("work", "createInfo", { code: ResponseCode.ok, message: "create complete" });
    getSocket(userId).send(sendData);
}

function deleteInfo(userId: string) {
    delete userWorkInfo[userId];
    const sendData = makePacket("work", "deleteInfo", { code: ResponseCode.ok, message: "delete complete" });
    getSocket(userId).send(sendData);
}

export default function work(userId: string, packet: TSocketPacket) {
    workLoadFuncs[packet.type](userId, packet.data);
}
