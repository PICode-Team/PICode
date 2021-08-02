import { TCommandData, UUIDToWorker } from "../../types/module/data/terminal.types";
import cluster from "cluster";
import { getSocket, makePacket } from "../socket/manager";
import os from "os";
import log from "../log";
import DataProjectManager from "./projectManager";
import path from "path";

export default class DataTerminalManager {
    static terminalInfo: UUIDToWorker = {};
    static ptyProcess: any;
    static projectPath: string;
    static rows: number;
    static messageHandleFunc: { [key in string]: (command?: string) => void } = {
        command: (command) => DataTerminalManager.ptyProcess.write(`${command}\r`),
        exit: () => process.exit(0),
    };

    static getUserTerminal(uuid: string) {
        return this.terminalInfo[uuid];
    }

    static createTerminal(userId: string, uuid: string, projectName: string, size: { cols: number; rows: number }) {
        try {
            const worker = cluster.fork();
            this.terminalInfo[uuid] = {
                socket: getSocket(userId),
                worker: worker,
            };
            worker.send({ type: "setup", setupData: { userId: userId, projectName: projectName, size: size } } as TCommandData);
            worker.on("message", (message) => {
                const sendData = JSON.stringify(makePacket("terminal", "commandTerminal", { message: message }));
                getSocket(userId).send(sendData);
            });
        } catch (e) {
            log.error(e.stack);
            return false;
        }
        return true;
    }

    static setUpTerminal() {
        if (cluster.isWorker) {
            const shell = os.platform() === "win32" ? "powershell.exe" : "bash";
            const pty = require("node-pty");

            process.on("message", (message: TCommandData) => {
                switch (message.type) {
                    case "command": {
                        DataTerminalManager.ptyProcess.write(`${message.command}\r`);
                        break;
                    }
                    case "exit": {
                        (<any>process).send({ type: "exit" } as TCommandData);
                        process.exit(0);
                        break;
                    }
                    case "setup": {
                        if (message.setupData !== undefined) {
                            const projectId = DataProjectManager.isValidAuth(message.setupData?.userId, message.setupData?.projectName, true)
                                ? DataProjectManager.getProjectId(message.setupData?.userId, message.setupData?.projectName)
                                : undefined;

                            this.projectPath = projectId !== undefined ? path.resolve(DataProjectManager.getProjectWorkPath(projectId)) : (process.env.HOME as string);
                            this.rows = message.setupData.size.cols ?? 80;
                            this.ptyProcess = pty.spawn(shell, [], {
                                name: "xterm-color",
                                cols: this.rows,
                                rows: message.setupData.size.rows ?? 30,
                                cwd: this.projectPath,
                            });

                            this.ptyProcess.on("data", function (data: any) {
                                (<any>process).send(`${data}`);
                            });
                        } else {
                            (<any>process).send(`no projectName or userId from message`);
                            process.exit(0);
                        }
                        break;
                    }
                    default: {
                        log.error(`terminal message type is not command | exit`);
                        break;
                    }
                }
            });
        }
    }

    static commandToTerminal(terminal: { command?: string; id: string }) {
        const terminalInfo = DataTerminalManager.getUserTerminal(terminal.id);
        terminalInfo.worker.send({ type: "command", msg: terminal.command } as TCommandData);
        return terminalInfo;
    }

    static deleteTerminal(terminal: { command?: string; id: string }) {
        const terminalInfo = DataTerminalManager.getUserTerminal(terminal.id);
        terminalInfo.worker.send({ type: "exit", msg: terminal.command } as TCommandData);
        return terminalInfo;
    }
}
