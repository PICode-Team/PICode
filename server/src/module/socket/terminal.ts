import { TSocketPacket } from "../../types/module/socket.types";
import { v4 as uuidv4 } from "uuid";
import log from "../log";
import { getSocket, makePacket } from "./manager";
import DataTerminalManager from "../data/terminalManager";
import DataProjectManager from "../data/projectManager";

function createTerminal(userId: string, { projectName, size, ip, socketPort }: { projectName: string; size: { cols: number; rows: number }; ip: string; socketPort: number }) {
    const uuid = uuidv4();
    const terminalWorker = DataTerminalManager.createTerminal(userId, uuid);
    const projectId = DataProjectManager.getProjectId(userId, projectName) ?? projectName;
    if (terminalWorker === undefined || projectId === undefined) {
        getSocket(userId)?.send(JSON.stringify(makePacket("terminal", "createTerminal", { message: "fail to create terminal" })));
    } else {
        DataTerminalManager.listenToTerminalWorker(userId, uuid, projectId as string, size, ip, socketPort);
        getSocket(userId)?.send(JSON.stringify(makePacket("terminal", "createTerminal", { uuid: uuid })));
    }
}

function commandTerminal(terminal: { command?: string; id: string }) {
    try {
        DataTerminalManager.commandToTerminal(terminal);
    } catch (e) {
        DataTerminalManager.getUserTerminal(terminal.id).socket.send(JSON.stringify(makePacket("terminal", "commandTerminal", { message: "fail to command terminal" })));
    }
}

function deleteTerminal(terminal: { command?: string; id: string }) {
    try {
        DataTerminalManager.deleteTerminal(terminal);
    } catch (e) {
        DataTerminalManager.getUserTerminal(terminal.id).socket.send(JSON.stringify(makePacket("terminal", "deleteTerminal", { message: "fail to delete terminal" })));
    }
}

export default function terminal(userId: string, packet: TSocketPacket) {
    switch (packet.type) {
        case "createTerminal": {
            createTerminal(userId, packet.data);
            break;
        }
        case "commandTerminal": {
            commandTerminal(packet.data);
            break;
        }
        case "deleteTerminal": {
            deleteTerminal(packet.data);
            break;
        }
        default: {
            log.error(`invalid packet type`);
            break;
        }
    }
}
