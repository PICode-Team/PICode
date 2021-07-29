import { TSocketPacket } from "../../types/module/socket.types";
import { makePacket, getSocket, userWorkInfo, getUserWork } from "./manager";

const workLoadFuncs: {
    [key in string]: (userId: string, workingPath: any) => void;
} = {
    createInfo: createInfo,
    getWorkingPath: getWorkingPath,
    deleteInfo: deleteInfo,
};

function getWorkingPath(userId: string, workingPath: string) {
    userWorkInfo[userId] = workingPath;

    Object.keys(userWorkInfo)
        .filter((otherUserId) => otherUserId !== userId)
        .forEach((otherUserId: string) => {
            const sendOwnData = JSON.stringify(
                makePacket("work", "getWorkingPath", {
                    userId: userId,
                    workingPath: workingPath,
                })
            );
            getSocket(otherUserId)?.send(sendOwnData);
            const otherWorkPath = getUserWork(otherUserId);
            const sendOtherData = JSON.stringify(
                makePacket("work", "getWorkingPath", {
                    userId: otherUserId,
                    workingPath: otherWorkPath,
                })
            );
            getSocket(userId).send(sendOtherData);
        });
}

function createInfo(userId: string, workingPath: string) {
    userWorkInfo[userId] = workingPath;
    const sendData = JSON.stringify(
        makePacket("work", "createInfo", { message: "create complete" })
    );
    getSocket(userId).send(sendData);
}

function deleteInfo(userId: string) {
    delete userWorkInfo[userId];
    const sendData = JSON.stringify(
        makePacket("work", "deleteInfo", { message: "delete complete" })
    );
    getSocket(userId).send(sendData);
}

export default function work(userId: string, packet: TSocketPacket) {
    workLoadFuncs[packet.type](userId, packet.data);
}
