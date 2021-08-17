import { ResponseCode } from "../../constants/response";
import { TkanbanCreateData, TkanbanData } from "../../types/module/data/kanban.types";
import { TSocketPacket } from "../../types/module/socket.types";
import DataKanbanManager from "../data/kanbanManager";
import { getSocket, makePacket } from "./manager";

const kanbanLoadFuncs: { [key in string]: (userId: string, kanbanData: any) => void } = {
    getKanban,
    createKanban,
    updateKanban,
    deleteKanban,
};

function getKanban(userId: string, options: Partial<TkanbanData>) {
    const kanbanData = DataKanbanManager.get(options);
    const sendData = JSON.stringify(makePacket("kanban", "getKanban", { code: ResponseCode.ok, kanbans: kanbanData }));
    getSocket(userId).send(sendData);
}

function createKanban(userId: string, kanbanData: TkanbanCreateData) {
    const kanbanUUID = DataKanbanManager.create(kanbanData);
    const sendData = JSON.stringify(makePacket("kanban", "createKanban", kanbanUUID ? { code: ResponseCode.ok, uuid: kanbanUUID } : { code: ResponseCode.internalError }));
    getSocket(userId).send(sendData);
}

function updateKanban(userId: string, kanbanData: Partial<TkanbanData>) {
    const sendData = JSON.stringify(
        makePacket("kanban", "updateKanban", DataKanbanManager.update(kanbanData.uuid as string, kanbanData) ? { code: ResponseCode.ok } : { code: ResponseCode.internalError })
    );
    getSocket(userId).send(sendData);
}

function deleteKanban(userId: string, kanbanUUID: Pick<TkanbanData, "uuid">) {
    const sendData = JSON.stringify(makePacket("kanban", "deleteKanban", DataKanbanManager.delete(kanbanUUID.uuid) ? { code: ResponseCode.ok } : { code: ResponseCode.internalError }));
    getSocket(userId).send(sendData);
}

export default function issue(userId: string, packet: TSocketPacket) {
    kanbanLoadFuncs[packet.type](userId, packet.data);
}
