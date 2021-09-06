import { TSocketPacket } from "../../types/module/socket.types";
import { makePacket, getSocket, userWorkInfo, getUserWork, SocketInfo } from "./manager";
import { TWorkInfo, TUserToWork } from "../../types/module/data/work.types";
import DataUserManager from "../data/userManager";

const workLoadFuncs: {
    [key in string]: (userId: string, workingPath: any) => void;
} = {
    createInfo: createInfo,
    getWorkingPath: getWorkingPath,
    deleteInfo: deleteInfo,
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
            getSocket(userIdElement).send(JSON.stringify(makePacket("work", "getWorkingPath", sendData)));
        });
}

function createInfo(userId: string, workInfo: TWorkInfo) {
    userWorkInfo[userId] = workInfo;
    const sendData = JSON.stringify(makePacket("work", "createInfo", { message: "create complete" }));
    getSocket(userId).send(sendData);
}

function deleteInfo(userId: string) {
    delete userWorkInfo[userId];
    const sendData = JSON.stringify(makePacket("work", "deleteInfo", { message: "delete complete" }));
    getSocket(userId).send(sendData);
}

export default function work(userId: string, packet: TSocketPacket) {
    workLoadFuncs[packet.type](userId, packet.data);
}
