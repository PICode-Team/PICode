import { ResponseCode } from "../../../../constants/response";
import { TIssueData, TIssueListData } from "../../../../types/module/data/service/issuespace/issue.types";
import { TSocketPacket } from "../../../../types/module/socket.types";
import DataIssueManager from "../../../data/issuespace/issueManager";
import { getSocket, makePacket } from "../etc/manager";

const issueLoadFuncs: Record<string, (userId: string, issueData: any) => void> = {
    getIssueDetail,
    getIssue,
    createIssue,
    updateIssue,
    deleteIssue,
};

function getIssueDetail(userId: string, { issueUUID }: { issueUUID: string }) {
    const metaData = DataIssueManager.getIssueOnlyIssueUUID(issueUUID);
    const sendData = makePacket("issue", "getIssueDetail", metaData);
    getSocket(userId).send(sendData);
}

function getIssue(userId: string, { kanbanUUID, options }: { kanbanUUID: string; options?: Partial<TIssueListData> }) {
    const metaData =
        options?.uuid !== undefined
            ? DataIssueManager.getIssueInfo(kanbanUUID, options.uuid)
            : DataIssueManager.getList(kanbanUUID, options);
    const sendData = makePacket(
        "issue",
        "getIssue",
        metaData ? { code: ResponseCode.ok, issues: metaData } : { code: ResponseCode.internalError }
    );
    getSocket(userId).send(sendData);
}

function createIssue(userId: string, { kanbanUUID, issueData }: { kanbanUUID: string; issueData: Omit<TIssueData, "issueId"> }) {
    const metaData = DataIssueManager.create(userId, kanbanUUID, issueData);
    const sendData = makePacket("issue", "createIssue", metaData);
    getSocket(userId).send(sendData);
}

function updateIssue(userId: string, { kanbanUUID, issueData }: { kanbanUUID: string; issueData: Partial<TIssueData> }) {
    const metaData = DataIssueManager.update(userId, kanbanUUID, issueData);
    const sendData = makePacket("issue", "updateIssue", metaData);
    getSocket(userId).send(sendData);
}

function deleteIssue(userId: string, { kanbanUUID, issueUUID }: { kanbanUUID: string; issueUUID: string }) {
    const metaData = DataIssueManager.delete(userId, kanbanUUID, issueUUID);
    const sendData = makePacket("issue", "deleteIssue", metaData);
    getSocket(userId).send(sendData);
}

export default function issue(userId: string, packet: TSocketPacket) {
    issueLoadFuncs[packet.type](userId, packet.data);
}
