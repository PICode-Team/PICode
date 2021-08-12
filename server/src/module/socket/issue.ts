import { ResponseCode } from "../../constants/response";
import { TIssueData } from "../../types/module/data/issue.types";
import { TSocketPacket } from "../../types/module/socket.types";
import DataIssueManager from "../data/issueManager";
import { getSocket, makePacket } from "./manager";

const issueLoadFuncs: {
    [key in string]:
        | ((userId: string, { kanbanUUID, issueUUID }: { kanbanUUID: string; issueUUID: string }) => void)
        | ((userId: string, { kanbanUUID, issueData }: { kanbanUUID: string; issueData: TIssueData }) => void);
} = {
    getIssues: getIssues,
    createIssue: createIssue,
    updateIssue: updateIssue,
    deleteIssue: deleteIssue,
};

function getIssues(userId: string, { kanbanUUID, issueUUID }: { kanbanUUID: string; issueUUID?: string }) {
    const metaData = DataIssueManager.get(kanbanUUID, issueUUID);
    const sendData = makePacket("issue", "getIssues", metaData ? { code: ResponseCode.ok, issues: metaData } : { code: ResponseCode.internalError });
    getSocket(userId).send(JSON.stringify(sendData));
}

function createIssue(userId: string, { kanbanUUID, issueData }: { kanbanUUID: string; issueData: TIssueData }) {
    const issueUUID = DataIssueManager.create(kanbanUUID, issueData);
    const sendData = makePacket("issue", "createIssues", issueUUID ? { code: ResponseCode.ok, uuid: issueUUID } : { code: ResponseCode.internalError });
    getSocket(userId).send(JSON.stringify(sendData));
}

function updateIssue(userId: string, { kanbanUUID, issueData }: { kanbanUUID: string; issueData: TIssueData }) {
    const sendData = makePacket("issue", "updateIssues", DataIssueManager.update(kanbanUUID, issueData) ? { code: ResponseCode.ok } : { code: ResponseCode.internalError });
    getSocket(userId).send(JSON.stringify(sendData));
}

function deleteIssue(userId: string, { kanbanUUID, issueUUID }: { kanbanUUID: string; issueUUID: string }) {
    const sendData = makePacket("issue", "deleteIssues", DataIssueManager.delete(kanbanUUID, issueUUID) ? { code: ResponseCode.ok } : { code: ResponseCode.internalError });
    getSocket(userId).send(JSON.stringify(sendData));
}

export default function issue(userId: string, packet: TSocketPacket) {
    issueLoadFuncs[packet.type](userId, packet.data);
}
