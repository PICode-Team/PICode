import { Worker } from "cluster";

export interface terminal {
    socket: WebSocket;
    worker: Worker;
}

export type UUIDToWorker = {
    [key in string]: terminal;
};

export interface TCommandData {
    type: "command" | "exit" | "setup";
    command?: string;
    setupData?: {
        userId: string;
        projectName: string;
        size: { cols: number; rows: number };
    };
}
