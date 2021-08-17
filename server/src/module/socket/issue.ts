import { ResponseCode } from "../../constants/response";
import { TIssueData, TIssueListData } from "../../types/module/data/issue.types";
import { TSocketPacket } from "../../types/module/socket.types";
import DataIssueManager from "../data/issueManager";
import { getSocket, makePacket } from "./manager";

const issueLoadFuncs: {
    [key in string]: (userId: string, issueData: any) => void;
} = {
    getIssue,
    createIssue,
    updateIssue,
    deleteIssue,
};

function getIssue(userId: string, { kanbanUUID, options }: { kanbanUUID: string; options?: Partial<TIssueListData> }) {
    const metaData = options?.uuid !== undefined ? DataIssueManager.getInfo(kanbanUUID, options.uuid) : DataIssueManager.getList(kanbanUUID, options);
    const sendData = makePacket("issue", "getIssue", metaData ? { code: ResponseCode.ok, issues: metaData } : { code: ResponseCode.internalError });
    getSocket(userId).send(JSON.stringify(sendData));
}

function createIssue(userId: string, { kanbanUUID, issueData }: { kanbanUUID: string; issueData: TIssueData }) {
    const issueUUID = DataIssueManager.create(kanbanUUID, issueData);
    const sendData = makePacket("issue", "createIssue", issueUUID ? { code: ResponseCode.ok, uuid: issueUUID } : { code: ResponseCode.internalError });
    getSocket(userId).send(JSON.stringify(sendData));
}

function updateIssue(userId: string, { kanbanUUID, issueData }: { kanbanUUID: string; issueData: Partial<TIssueData> }) {
    const sendData = makePacket("issue", "updateIssue", DataIssueManager.update(kanbanUUID, issueData) ? { code: ResponseCode.ok } : { code: ResponseCode.internalError });
    getSocket(userId).send(JSON.stringify(sendData));
}

function deleteIssue(userId: string, { kanbanUUID, issueUUID }: { kanbanUUID: string; issueUUID: string }) {
    const sendData = makePacket("issue", "deleteIssue", DataIssueManager.delete(kanbanUUID, issueUUID) ? { code: ResponseCode.ok } : { code: ResponseCode.internalError });
    getSocket(userId).send(JSON.stringify(sendData));
}

export default function issue(userId: string, packet: TSocketPacket) {
    issueLoadFuncs[packet.type](userId, packet.data);
}
