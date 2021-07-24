export type TSocketInfo = {
    [key in string]: WebSocket;
};

export interface TSocketPacket {
    category: "chat" | "connect";
    type: string;
    data: any;
}
