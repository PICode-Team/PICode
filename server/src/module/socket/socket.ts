import expressWs from "express-ws";
import { TSocketPacket } from "../../types/module/socket.types";
import log from "../log";
import chat from "./chat";
import code from "./code";

import { SocketInfo } from "./manager";

const SocketFuncs = {
    chat: chat,
    code: code,
};

export function webSocketInit(server: expressWs.Application) {
    server.ws("/", (ws, req) => {
        if (req?.session?.userId === undefined) {
            return ws.close();
        }

        const userId = req?.session?.userId;
        ws.on("message", (msg) => {
            if (req.session.userId === undefined) {
                return;
            }

            try {
                const data = JSON.parse(msg.toString()) as TSocketPacket;

                if (data.category === "connect") {
                    SocketInfo[userId] = ws as any;
                    return;
                }

                SocketFuncs[data.category](userId, data);
            } catch (e) {
                log.error(e.stack);
            }
        });

        ws.on("close", () => {
            delete SocketInfo[userId];
        });
    });
}