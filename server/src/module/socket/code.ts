import { TSocketPacket } from "../../types/module/socket.types";
import { getSocket, makePacket } from "./manager";
import DataWorkspaceManager from "../data/workspaceManager";

const codeLoadFuncs: {
    [key in string]: (userId: string, workspaceInfo: any) => void;
} = {
    loadWorkspace: loadWorkspace,
    getCode: getCode,
    changeCode: changeCode,
    moveFileOrDir: moveFileOrDir,
    createDir: createDir,
    createFile: createFile,
    deleteFileOrDir: deleteFileOrDir,
};

function loadWorkspace(userId: string, data: { workspaceId: string }) {
    const sendData = JSON.stringify(makePacket("code", "loadWorkspace", DataWorkspaceManager.getAllWorkspacePath(userId, data.workspaceId)));
    getSocket(userId).send(sendData);
}

function getCode(userId: string, data: { workspaceId: string; filePath: string }) {
    const sendData = JSON.stringify(makePacket("code", "getCode", DataWorkspaceManager.getCodesFromWorkspace(userId, data)));
    getSocket(userId).send(sendData);
}

function changeCode(userId: string, data: { workspaceId: string; filePath: string; code: string }) {
    const sendData = JSON.stringify(makePacket("code", "changeCode", DataWorkspaceManager.changeWorkspaceCode(userId, data)));
    getSocket(userId).send(sendData);
}

function moveFileOrDir(userId: string, data: { workspaceId: string; oldPath: string; newPath: string }) {
    const sendData = JSON.stringify(makePacket("code", "moveFileOrDir", DataWorkspaceManager.moveWorkspaceFileOrDir(userId, data)));
    getSocket(userId).send(sendData);
}

function deleteFileOrDir(userId: string, data: { workspaceId: string; deletePath: string; recursive?: boolean }) {
    const sendData = JSON.stringify(makePacket("code", "deleteFileOrDir", DataWorkspaceManager.deleteFileOrDir(userId, data)));
    getSocket(userId).send(sendData);
}

function createFile(userId: string, data: { workspaceId: string; filePath: string }) {
    const sendData = JSON.stringify(makePacket("code", "createFile", DataWorkspaceManager.createWorkspaceFile(userId, data)));
    getSocket(userId).send(sendData);
}

function createDir(userId: string, data: { workspaceId: string; dirPath: string }) {
    const sendData = JSON.stringify(makePacket("code", "createDir", DataWorkspaceManager.createWorkspaceDir(userId, data)));
    getSocket(userId).send(sendData);
}

export default function code(userId: string, packet: TSocketPacket) {
    codeLoadFuncs[packet.type](userId, packet.data);
}
