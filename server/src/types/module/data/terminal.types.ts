import net from "net";

export interface terminal {
    socket: WebSocket;
    net: net.Socket;
}

export type UUIDToSocket = {
    [key in string]: terminal;
};

export interface TCommandData {
    type: "command" | "exit" | "setup";
    command?: string;
    setupData?: {
        projectPath: string;
        size: { cols: number; rows: number };
    };
}
