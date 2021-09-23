import expressWs from "express-ws";
import { TSocketPacket } from "../../types/module/socket.types";
import { SocketInfo } from "./manager";
import log from "../log";
import chat from "./chat";
import code from "./code";
import work from "./work";
import terminal from "./terminal";
import user from "./user";
import issue from "./issue";
import kanban from "./kanban";
import alarm from "./alarm";
import milestone from "./milestone";
import note from "./note";
import { verifyToken } from "../token";

const SocketFuncs = {
    chat,
    code,
    work,
    terminal,
    user,
    issue,
    kanban,
    alarm,
    milestone,
    note,
};

export function webSocketInit(server: expressWs.Application) {
    server.ws("/", (_, req, next)=>{
        try {
            req.token = verifyToken(req.cookies.authorization)
            next()
        } catch {}
    }, (ws, req) => {
        const userId = req.token.userId!
        if (userId === undefined) {
            return ws.close();
        }

        ws.on("message", (msg) => {
            if (req.query.userId === undefined) {
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
