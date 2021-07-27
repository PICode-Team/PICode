export type TSocketInfo = {
    [key in string]: WebSocket;
};

export type TUserWorkInfo = {
    [key in string]: string;
};

export interface TSocketPacket {
    category: "chat" | "connect" | "code" | "work";
    type: string;
    data: any;
}
