import { TSocketPacket } from "../../types/module/socket.types";
import { getSocket, makePacket } from "./manager";
import DataProjectManager from "../data/projectManager";

const codeLoadFuncs: {
    [key in string]: (userId: string, projectInfo: any) => void;
} = {
    loadProject: loadProject,
    getCode: getCode,
    changeCode: changeCode,
    moveFileOrDir: moveFileOrDir,
    createDir: createDir,
    createFile: createFile,
    deleteFileOrDir: deleteFileOrDir,
};

function loadProject(userId: string, data: { projectName: string }) {
    const sendData = JSON.stringify(makePacket("code", "loadProject", DataProjectManager.getAllProjectPath(userId, data.projectName)));
    getSocket(userId).send(sendData);
}

function getCode(userId: string, data: { projectName: string; filePath: string }) {
    const sendData = JSON.stringify(makePacket("code", "getCode", DataProjectManager.getCodesFromProject(userId, data)));
    getSocket(userId).send(sendData);
}

function changeCode(userId: string, data: { projectName: string; filePath: string; code: string }) {
    const sendData = JSON.stringify(makePacket("code", "changeCode", DataProjectManager.changeProjectCode(userId, data)));
    getSocket(userId).send(sendData);
}

function moveFileOrDir(userId: string, data: { projectName: string; oldPath: string; newPath: string }) {
    const sendData = JSON.stringify(makePacket("code", "moveFileOrDir", DataProjectManager.moveProjectFileOrDir(userId, data)));
    getSocket(userId).send(sendData);
}

function deleteFileOrDir(userId: string, data: { projectName: string; deletePath: string; recursive?: boolean }) {
    const sendData = JSON.stringify(makePacket("code", "deleteFileOrDir", DataProjectManager.deleteFileOrDir(userId, data)));
    getSocket(userId).send(sendData);
}

function createFile(userId: string, data: { projectName: string; filePath: string }) {
    const sendData = JSON.stringify(makePacket("code", "createFile", DataProjectManager.createProjectFile(userId, data)));
    getSocket(userId).send(sendData);
}

function createDir(userId: string, data: { projectName: string; dirPath: string }) {
    const sendData = JSON.stringify(makePacket("code", "createDir", DataProjectManager.createProjectDir(userId, data)));
    getSocket(userId).send(sendData);
}

export default function code(userId: string, packet: TSocketPacket) {
    codeLoadFuncs[packet.type](userId, packet.data);
}
