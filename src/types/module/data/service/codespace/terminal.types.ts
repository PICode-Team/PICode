import { ChildProcess } from "child_process";

export interface terminal {
    socket: WebSocket;
    childProcess: ChildProcess;
}

export type UUIDToTerminal = Record<string, terminal>;

export interface TCommandData {
    type: "command" | "exit" | "setup";
    command?: string;
    setupData?: {
        workspacePath: string;
        size: { cols: number; rows: number };
    };
}
