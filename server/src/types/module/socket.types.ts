export type TSocketInfo = {
    [key in string]: WebSocket;
};

export type TSocketCategory = "chat" | "connect" | "code" | "work" | "terminal" | 'user'

export interface TSocketPacket {
    category: TSocketCategory;
    type: string;
    data: any;
}
