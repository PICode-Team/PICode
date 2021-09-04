import { getSocket, makePacket } from "../socket/manager";
import log from "../log";
import DataProjectManager from "./projectManager";
import net from "net";
import { UUIDToSocket } from "../../types/module/data/terminal.types";
const terminalInfo: UUIDToSocket = {};

export default class DataTerminalManager {
    static getUserTerminal(uuid: string) {
        return terminalInfo[uuid];
    }

    static serialize(data: object) {
        return JSON.stringify(data);
    }

    static createTerminal(userId: string, uuid: string) {
        const socket = new net.Socket();

        terminalInfo[uuid] = {
            socket: getSocket(userId),
            net: socket,
        };

        return socket;
    }

    static listenToTerminalWorker(userId: string, uuid: string, projectId: string, size: { cols: number; rows: number }, ip: string, socketPort: number) {
        const socketInfo = terminalInfo[uuid].net;
        socketInfo.connect({ host: ip, port: socketPort }, () => {
            socketInfo.on("data", function (chunk) {
                const data = JSON.parse(chunk.toString());
                switch (data.type) {
                    case "command": {
                        getSocket(userId).send(JSON.stringify(makePacket("terminal", "commandTerminal", { message: data.command, uuid: uuid })));
                        break;
                    }
                    case "setup": {
                        getSocket(userId).send(JSON.stringify(makePacket("terminal", "createTerminal", { message: data.command, uuid: uuid })));
                        break;
                    }
                    case "exit": {
                        getSocket(userId).send(JSON.stringify(makePacket("terminal", "deleteTerminal", { uuid: uuid })));
                        socketInfo.destroy();
                        break;
                    }
                }
            });
        });
        socketInfo.on("error", (error) => {
            log.error(`terminal error occured! ${error}`);
        });

        socketInfo.write(this.serialize({ type: "setup", setupData: { projectPath: DataProjectManager.getProjectWorkPath(projectId), size: size } }));
    }

    static commandToTerminal(terminal: { command?: string; id: string }) {
        terminalInfo[terminal.id].net.write(this.serialize({ type: "command", command: terminal.command }));
    }

    static deleteTerminal(terminal: { command?: string; id: string }) {
        terminalInfo[terminal.id].net.write(this.serialize({ type: "exit" }));
    }
}
