import expressWs from "express-ws";
import { TSocketPacket } from "../../types/module/socket.types";
import { SocketInfo } from "./service/etc/manager";
import log from "../log";
import chat from "./service/chatspace/chat";
import code from "./service/codespace/code";
import work from "./service/etc/work";
import terminal from "./service/codespace/terminal";
import user from "./service/etc/user";
import issue from "./service/issuespace/issue";
import kanban from "./service/issuespace/kanban";
import alarm from "./service/alarm/alarm";
import milestone from "./service/issuespace/milestone";
import note from "./service/notespace/note";
import { verifyToken } from "../token";
import calendar from "./service/calendar/calendar";
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
    calendar,
};

export function webSocketInit(server: expressWs.Application) {
    server.ws(
        "/",
        (_, req, next) => {
            try {
                req.token = verifyToken(req.cookies.authorization);
                next();
            } catch {}
        },
        (ws, req) => {
            const userId = req.token.userId!;
            if (userId === undefined) {
                return ws.close();
            }

            ws.on("message", (msg) => {
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
        }
    );
}
