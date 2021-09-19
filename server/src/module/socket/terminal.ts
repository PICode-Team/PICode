import { TSocketPacket } from "../../types/module/socket.types";
import { v4 as uuidv4 } from "uuid";
import log from "../log";
import { getSocket, makePacket } from "./manager";
import DataTerminalManager from "../data/terminalManager";
import DataWorkspaceManager from "../data/workspaceManager";

function createTerminal(userId: string, { workspaceName, size }: { workspaceName: string; size: { cols: number; rows: number } }) {
    const uuid = uuidv4();
    const terminalWorker = DataTerminalManager.createTerminal(userId, uuid);
    const workspaceId = DataWorkspaceManager.getWorkspaceId(userId, workspaceName);
    if (terminalWorker === undefined || workspaceId === undefined) {
        getSocket(userId)?.send(JSON.stringify(makePacket("terminal", "createTerminal", { message: "fail to create terminal" })));
    } else {
        DataTerminalManager.listenToTerminalWorker(userId, uuid, workspaceId as string, terminalWorker, size);
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
