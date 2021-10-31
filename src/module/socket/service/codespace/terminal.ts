import { TSocketPacket } from "../../../../types/module/socket.types";
import { v4 as uuidv4 } from "uuid";
import log from "../../../log";
import { getSocket, makePacket } from "../etc/manager";
import DataTerminalManager from "../../../data/codespace/terminalManager";
import { ResponseCode } from "../../../../constants/response";

function createTerminal(userId: string, { workspaceId, size }: { workspaceId: string; size: { cols: number; rows: number } }) {
    const uuid = uuidv4();
    const terminalWorker = DataTerminalManager.createTerminal(userId, uuid);
    if (terminalWorker === undefined || workspaceId === undefined) {
        getSocket(userId)?.send(
            makePacket("terminal", "createTerminal", { code: ResponseCode.internalError, message: "fail to create terminal" })
        );
    } else {
        DataTerminalManager.listenToTerminalWorker(userId, uuid, workspaceId, terminalWorker, size);
        getSocket(userId)?.send(makePacket("terminal", "createTerminal", { code: ResponseCode.ok, uuid: uuid }));
    }
}

function commandTerminal(terminal: { command?: string; id: string }) {
    try {
        DataTerminalManager.commandToTerminal(terminal);
    } catch (e) {
        DataTerminalManager.getUserTerminal(terminal.id).socket?.send(
            makePacket("terminal", "commandTerminal", { code: ResponseCode.internalError, message: "fail to command terminal" })
        );
    }
}

function deleteTerminal(terminal: { command?: string; id: string }) {
    try {
        DataTerminalManager.deleteTerminal(terminal);
    } catch (e) {
        DataTerminalManager.getUserTerminal(terminal.id).socket?.send(
            makePacket("terminal", "deleteTerminal", { message: "fail to delete terminal" })
        );
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
