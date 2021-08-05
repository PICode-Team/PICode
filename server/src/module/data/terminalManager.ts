import {
    TCommandData,
    UUIDToWorker,
} from "../../types/module/data/terminal.types";
import { Worker } from "worker_threads";
import { getSocket, makePacket } from "../socket/manager";
import log from "../log";
import DataProjectManager from "./projectManager";
import path from "path";

const terminalInfo: UUIDToWorker = {};

export default class DataTerminalManager {
    static projectPath: string;

    static getUserTerminal(uuid: string) {
        return terminalInfo[uuid];
    }

    static createTerminal(userId: string, uuid: string) {
        const worker = new Worker(path.resolve(__dirname, "../terminal.js"));
        try {
            terminalInfo[uuid] = {
                socket: getSocket(userId),
                worker: worker,
            };
        } catch (e) {
            log.error(e.stack);
            return undefined;
        }
        return worker;
    }

    static listenToTerminalWorker(
        userId: string,
        uuid: string,
        projectId: string,
        worker: Worker,
        size: { cols: number; rows: number }
    ) {
        worker.postMessage({
            type: "setup",
            setupData: {
                projectPath: DataProjectManager.getProjectWorkPath(projectId),
                size: size,
            },
        } as TCommandData);
        worker.on("message", (message: TCommandData) => {
            switch (message.type) {
                case "command": {
                    const sendData = JSON.stringify(
                        makePacket("terminal", "commandTerminal", {
                            message: message.command,
                            uuid: uuid,
                        })
                    );
                    getSocket(userId).send(sendData);
                    break;
                }
                case "exit": {
                    const sendData = JSON.stringify(
                        makePacket("terminal", "deleteTerminal", { uuid: uuid })
                    );
                    getSocket(userId).send(sendData);
                    terminalInfo[uuid].worker.terminate();
                    delete terminalInfo[uuid];
                    break;
                }
            }
        });
    }

    static commandToTerminal(terminal: { command?: string; id: string }) {
        const terminalInfo = DataTerminalManager.getUserTerminal(terminal.id);
        terminalInfo.worker.postMessage({
            type: "command",
            command: terminal.command,
        } as TCommandData);
        return terminalInfo;
    }

    static deleteTerminal(terminal: { command?: string; id: string }) {
        const terminalInfo = DataTerminalManager.getUserTerminal(terminal.id);
        terminalInfo.worker.postMessage({
            type: "exit",
            command: terminal.command,
        } as TCommandData);
        return terminalInfo;
    }
}
