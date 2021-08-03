import { TSocketPacket } from "../../types/module/socket.types";
import { v4 as uuidv4 } from "uuid";
import log from "../log";
import { getSocket, makePacket } from "./manager";
import DataTerminalManager from "../data/terminalManager";
import { TCommandData } from "../../types/module/data/terminal.types";

function createTerminal(userId: string, { projectName, size }: { projectName: string; size: { cols: number; rows: number } }) {
    const uuid = uuidv4();

    const createTerminalResult = DataTerminalManager.createTerminal(userId, uuid, projectName, size);
    const metaData = createTerminalResult ? { uuid: uuid } : { message: "fail to create terminal" };
    getSocket(userId)?.send(JSON.stringify(makePacket("terminal", "createTerminal", metaData)));
}

function commandTerminal(terminal: { command?: string; id: string }) {
    const terminalInfo = DataTerminalManager.getUserTerminal(terminal.id);
    terminalInfo.worker.send({ type: "command", command: terminal.command } as TCommandData);
}

function deleteTerminal(terminal: { command?: string; id: string }) {
    try {
        const terminalInfo = DataTerminalManager.getUserTerminal(terminal.id);
        terminalInfo.worker.send({ type: "exit", command: terminal.command } as TCommandData);
        delete DataTerminalManager.terminalInfo[terminal.id];
    } catch (e) {
        log.error(e.stack);
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
