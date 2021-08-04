import { TCommandData, UUIDToWorker } from "../../types/module/data/terminal.types";
import cluster, { Worker } from "cluster";
import { getSocket, makePacket } from "../socket/manager";
import os from "os";
import log from "../log";
import DataProjectManager from "./projectManager";

var ptyProcess: any;
const terminalInfo: UUIDToWorker = {};

export default class DataTerminalManager {
    static projectPath: string;

    static getUserTerminal(uuid: string) {
        return terminalInfo[uuid];
    }

    static createTerminal(userId: string, uuid: string) {
        const worker = cluster.fork();
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

    static listenToTerminalWorker(userId: string, uuid: string, projectId: string, worker: Worker, size: { cols: number; rows: number }) {
        worker.send({ type: "setup", setupData: { projectId: projectId, size: size } } as TCommandData);
        worker.on("message", (message: TCommandData) => {
            switch (message.type) {
                case "command": {
                    const sendData = JSON.stringify(makePacket("terminal", "commandTerminal", { message: message.command, uuid: uuid }));
                    getSocket(userId).send(sendData);
                    break;
                }
                case "exit": {
                    const sendData = JSON.stringify(makePacket("terminal", "deleteTerminal", { uuid: uuid }));
                    getSocket(userId).send(sendData);
                    delete terminalInfo[uuid];
                    break;
                }
            }
        });
    }

    static setUpTerminal() {
        process.on("message", (message: TCommandData) => {
            const workerFunc: { [key in string]: (message: TCommandData) => void } = {
                command: this.workerCommand,
                exit: this.workerExit,
                setup: this.workerSetUp,
            };
            workerFunc[message.type](message);
        });
    }

    static workerCommand(message: TCommandData) {
        message.command === "exit" ? DataTerminalManager.workerExit() : ptyProcess.write(`${message.command}\r`);
    }

    static workerExit() {
        (<any>process).send({ type: "exit" } as TCommandData);
        process.exit(0);
    }

    static workerSetUp(message: TCommandData) {
        const shell = os.platform() === "win32" ? "powershell.exe" : "bash";
        const pty = require("node-pty");
        if (message.setupData === undefined) {
            (<any>process).send({ type: "setup", command: `no setupData from message` } as TCommandData);
            process.exit(0);
        }
        ptyProcess = pty.spawn(shell, [], {
            name: "xterm-color",
            cols: message.setupData.size.cols ?? 150,
            rows: message.setupData.size.rows ?? 100,
            cwd: DataProjectManager.getProjectWorkPath(message.setupData.projectId),
        });

        ptyProcess.on("data", function (data: any) {
            (<any>process).send({ type: "command", command: data } as TCommandData);
        });
    }

    static commandToTerminal(terminal: { command?: string; id: string }) {
        const terminalInfo = DataTerminalManager.getUserTerminal(terminal.id);
        terminalInfo.worker.send({ type: "command", command: terminal.command } as TCommandData);
        return terminalInfo;
    }

    static deleteTerminal(terminal: { command?: string; id: string }) {
        const terminalInfo = DataTerminalManager.getUserTerminal(terminal.id);
        terminalInfo.worker.send({ type: "exit", command: terminal.command } as TCommandData);
        return terminalInfo;
    }
}
