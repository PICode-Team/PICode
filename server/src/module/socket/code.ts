import { TSocketPacket } from "../../types/module/socket.types";
import { getSocket, makePacket } from "./manager";
import DataProjectManager from "../data/projectManager";

const codeLoadFuncs: {
    [key in string]: (userId: string, projectInfo: any) => void;
} = {
    getCode: getCode,
    changeCode: changeCode,
    moveFileOrDir: moveFileOrDir,
    createDir: createDir,
    createFile: createFile,
    deleteFileOrDir: deleteFileOrDir,
};

function getCode(userId: string, projectInfo: { projectName: string; filePath: string }) {
    const sendData = JSON.stringify(makePacket("code", "getCode", DataProjectManager.getCodesFromProject(userId, projectInfo)));
    getSocket(userId).send(sendData);
}

function changeCode(userId: string, projectInfo: { projectName: string; filePath: string; code: string }) {
    const sendData = JSON.stringify(makePacket("code", "changeCode", DataProjectManager.changeProjectCode(userId, projectInfo)));
    getSocket(userId).send(sendData);
}

function moveFileOrDir(userId: string, projectInfo: { projectName: string; oldPath: string; newPath: string }) {
    const sendData = JSON.stringify(makePacket("code", "moveFileOrDir", DataProjectManager.moveProjectFileOrDir(userId, projectInfo)));
    getSocket(userId).send(sendData);
}

function deleteFileOrDir(userId: string, projectInfo: { projectName: string; deletePath: string; recursive?: boolean }) {
    const sendData = JSON.stringify(makePacket("code", "deleteFileOrDir", DataProjectManager.deleteFileOrDir(userId, projectInfo)));
    getSocket(userId).send(sendData);
}

function createFile(userId: string, projectInfo: { projectName: string; filePath: string }) {
    const sendData = JSON.stringify(makePacket("code", "createFile", DataProjectManager.createProjectFile(userId, projectInfo)));
    getSocket(userId).send(sendData);
}

function createDir(userId: string, projectInfo: { projectName: string; dirPath: string }) {
    const sendData = JSON.stringify(makePacket("code", "createDir", DataProjectManager.createProjectDir(userId, projectInfo)));
    getSocket(userId).send(sendData);
}

export default function code(userId: string, packet: TSocketPacket) {
    codeLoadFuncs[packet.type](userId, packet.data.projectInfo);
}
