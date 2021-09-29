import { TSocketPacket } from "../../types/module/socket.types";
import { getSocket, makePacket } from "./manager";
import DataWorkspaceManager from "../data/service/workspace/workspaceManager";

const codeLoadFuncs: Record<string, (userId: string, workspaceInfo: any) => void> = {
    loadWorkspace,
    getCode,
    changeCode,
    moveFileOrDir,
    createDir,
    createFile,
    deleteFileOrDir,
};

function loadWorkspace(userId: string, data: { workspaceId: string }) {
    const sendData = makePacket("code", "loadWorkspace", DataWorkspaceManager.getAllWorkspacePath(userId, data.workspaceId));
    getSocket(userId).send(sendData);
}

function getCode(userId: string, data: { workspaceId: string; filePath: string }) {
    const sendData = makePacket("code", "getCode", DataWorkspaceManager.getCodesFromWorkspace(userId, data));
    getSocket(userId).send(sendData);
}

function changeCode(userId: string, data: { workspaceId: string; filePath: string; code: string }) {
    const sendData = makePacket("code", "changeCode", DataWorkspaceManager.changeWorkspaceCode(userId, data));
    getSocket(userId).send(sendData);
}

function moveFileOrDir(userId: string, data: { workspaceId: string; oldPath: string; newPath: string }) {
    const sendData = makePacket("code", "moveFileOrDir", DataWorkspaceManager.moveWorkspaceFileOrDir(userId, data));
    getSocket(userId).send(sendData);
}

function deleteFileOrDir(userId: string, data: { workspaceId: string; deletePath: string; recursive?: boolean }) {
    const sendData = makePacket("code", "deleteFileOrDir", DataWorkspaceManager.deleteFileOrDir(userId, data));
    getSocket(userId).send(sendData);
}

function createFile(userId: string, data: { workspaceId: string; filePath: string }) {
    const sendData = makePacket("code", "createFile", DataWorkspaceManager.createWorkspaceFile(userId, data));
    getSocket(userId).send(sendData);
}

function createDir(userId: string, data: { workspaceId: string; dirPath: string }) {
    const sendData = makePacket("code", "createDir", DataWorkspaceManager.createWorkspaceDir(userId, data));
    getSocket(userId).send(sendData);
}

export default function code(userId: string, packet: TSocketPacket) {
    codeLoadFuncs[packet.type](userId, packet.data);
}
