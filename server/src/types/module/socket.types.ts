export type TSocketInfo = {
    [key in string]: WebSocket;
};

export type TSocketCategory =
    | "chat"
    | "connect"
    | "code"
    | "work"
    | "terminal"
    | "user"
    | "issue"
    | "kanban"
    | "milestone"
    | "alarm"
    | "document"
    | "docker";

export interface TSocketPacket {
    category: TSocketCategory;
    type: string;
    data: any;
}
