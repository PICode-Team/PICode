import { ResponseCode } from "../../constants/response";
import { TkanbanCreateData, TkanbanData } from "../../types/module/data/service/issuespace/kanban.types";
import { TSocketPacket } from "../../types/module/socket.types";
import DataKanbanManager from "../data/service/issuespace/kanbanManager";
import { getSocket, makePacket } from "./manager";

const kanbanLoadFuncs: Record<string, (userId: string, kanbanData: any) => void> = {
    getKanban,
    createKanban,
    updateKanban,
    deleteKanban,
};

function getKanban(userId: string, options: Partial<TkanbanData>) {
    const kanbanData = DataKanbanManager.get(options);
    const sendData = makePacket("kanban", "getKanban", { code: ResponseCode.ok, kanbans: kanbanData });
    getSocket(userId).send(sendData);
}

function createKanban(userId: string, kanbanData: TkanbanCreateData) {
    const metaData = DataKanbanManager.create(userId, kanbanData);
    const sendData = makePacket("kanban", "createKanban", metaData);
    getSocket(userId).send(sendData);
}

function updateKanban(userId: string, kanbanData: Partial<TkanbanData>) {
    const metaData = DataKanbanManager.update(kanbanData.uuid as string, kanbanData, userId);
    const sendData = makePacket("kanban", "updateKanban", metaData);
    getSocket(userId).send(sendData);
}

function deleteKanban(userId: string, kanbanUUID: Pick<TkanbanData, "uuid">) {
    const metaData = DataKanbanManager.delete(userId, kanbanUUID.uuid);
    const sendData = makePacket("kanban", "deleteKanban", metaData);
    getSocket(userId).send(sendData);
}

export default function kanban(userId: string, packet: TSocketPacket) {
    kanbanLoadFuncs[packet.type](userId, packet.data);
}
