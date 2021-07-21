export type TSocketInfo = {
    [key in string]: WebSocket;
};

export interface TSocketPacket {
    category: "chat" | "connect" | "code";
    type: string;
    data: any;
}
