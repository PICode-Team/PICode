import { TCommandData, UUIDToTerminal } from "../../../types/module/data/service/codespace/terminal.types";
import { getSocket, makePacket } from "../../socket/service/etc/manager";
import log from "../../log";
import DataWorkspaceManager from "../workspace/workspaceManager";
import path from "path";
import { ResponseCode } from "../../../constants/response";
import { ChildProcess, fork } from "child_process";
import { writeFileSync } from 'fs';

const terminalInfo: UUIDToTerminal = {};

export default class DataTerminalManager {
    static workspacePath: string;

    static getUserTerminal(uuid: string) {
        return terminalInfo[uuid];
    }

    static createTerminal(userId: string, uuid: string) {
        const forkProcess = fork("./lib/terminal.js")
        try {
            terminalInfo[uuid] = {
                socket: getSocket(userId),
                childProcess: forkProcess,
            };
        } catch (e) {
            log.error(e.stack);
            return undefined;
        }
        return forkProcess;
    }

    static listenToTerminalWorker(userId: string, uuid: string, workspaceId: string, childProcess: ChildProcess, size: { cols: number; rows: number }) {
        const workspacePath = DataWorkspaceManager.getWorkspaceWorkPath(workspaceId);
        childProcess.send({
            type: "setup",
            setupData: { workspacePath, size: size },
        } as TCommandData);
        childProcess.on("message", (message: TCommandData) => {
            switch (message.type) {
                case "command": {
                    const replacePath = path.resolve(workspacePath).replace(/\\/g, "\\\\");
                    const re = new RegExp(replacePath, "gi");
        
                    console.log(JSON.stringify({
                        msg: message.command.replace(/\x1B/g, '\\X1B')
                    }))

                    const splitIndex = message.command.search("\u0007")

                    const sendData = makePacket("terminal", "commandTerminal", {
                        code: ResponseCode.ok,
                        message: message.command.slice(splitIndex),
                        uuid: uuid,
                    });
                    getSocket(userId).send(sendData);
                    break;
                }
                case "exit": {
                    const sendData = makePacket("terminal", "deleteTerminal", { code: ResponseCode.ok, uuid: uuid });
                    getSocket(userId).send(sendData);
                    terminalInfo[uuid].childProcess.disconnect();
                    delete terminalInfo[uuid];
                    break;
                }
            }
        });
    }

    static commandToTerminal(terminal: { command?: string; id: string }) {
        const terminalInfo = DataTerminalManager.getUserTerminal(terminal.id);
        terminalInfo.childProcess.send({ type: "command", command: terminal.command } as TCommandData);
        return terminalInfo;
    }

    static deleteTerminal(terminal: { command?: string; id: string }) {
        const terminalInfo = DataTerminalManager.getUserTerminal(terminal.id);
        terminalInfo.childProcess.send({ type: "exit", command: terminal.command } as TCommandData);
        return terminalInfo;
    }
}