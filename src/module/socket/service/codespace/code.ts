import { TSocketPacket } from "../../../../types/module/socket.types";
import { getSocket, makePacket } from "../etc/manager";
import DataCodeManager from "../../../data/codespace/codeManager";
import { TReadyQueueItem } from "../../../../types/module/data/service/etc/merge.types";

const codeLoadFuncs: Record<string, (userId: string, workspaceInfo: any) => void> = {
    getAllFilePath,
    getCode,
    changeCode,
    updateCode,
    moveFileOrDir,
    createDir,
    createFile,
    deleteFileOrDir,
};

function getAllFilePath(userId: string, data: { workspaceId: string }) {
    const sendData = makePacket("code", "getAllFilePath", DataCodeManager.getAllFilePath(userId, data.workspaceId));
    getSocket(userId)?.send(sendData);
}

function getCode(userId: string, data: { workspaceId: string; filePath: string }) {
    const sendData = makePacket("code", "getCode", DataCodeManager.get(userId, data));
    getSocket(userId)?.send(sendData);
}

function changeCode(userId: string, data: { workspaceId: string; filePath: string; code: string }) {
    const sendData = makePacket("code", "changeCode", DataCodeManager.changeCode(userId, data));
    getSocket(userId)?.send(sendData);
}

function updateCode(userId: string, data: { workspaceId: string; updateContent: TReadyQueueItem }) {
    const sendData = makePacket("code", "updateCode", DataCodeManager.updateCode(userId, data));
    getSocket(userId)?.send(sendData);
}

function moveFileOrDir(userId: string, data: { workspaceId: string; oldPath: string; newPath: string }) {
    const sendData = makePacket("code", "moveFileOrDir", DataCodeManager.moveFileOrDir(userId, data));
    getSocket(userId)?.send(sendData);
}

function deleteFileOrDir(userId: string, data: { workspaceId: string; deletePath: string; recursive?: boolean }) {
    const sendData = makePacket("code", "deleteFileOrDir", DataCodeManager.deleteFileOrDir(userId, data));
    getSocket(userId)?.send(sendData);
}

function createFile(userId: string, data: { workspaceId: string; filePath: string }) {
    const sendData = makePacket("code", "createFile", DataCodeManager.createFile(userId, data));
    getSocket(userId)?.send(sendData);
}

function createDir(userId: string, data: { workspaceId: string; dirPath: string }) {
    const sendData = makePacket("code", "createDir", DataCodeManager.createDir(userId, data));
    getSocket(userId)?.send(sendData);
}

export default function code(userId: string, packet: TSocketPacket) {
    codeLoadFuncs[packet.type](userId, packet.data);
}
