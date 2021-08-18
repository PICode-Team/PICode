import { ResponseCode } from "../../constants/response";
import { TMilestoneData } from "../../types/module/data/milestone.types";
import { TSocketPacket } from "../../types/module/socket.types";
import DataMilestoneManager from "../data/milestoneManager";
import { getSocket, makePacket } from "./manager";

const milestoneLoadFuncs: { [key in string]: Function } = {
    getMilestone: getMilestone,
    createMilestone: createMilestone,
    updateMilestone: updateMilestone,
    deleteMilestone: deleteMilestone,
};

function getMilestone(userId: string, { mileStoneUUID }: { mileStoneUUID?: string }) {
    const metaData = DataMilestoneManager.get(mileStoneUUID);
    const sendData = JSON.stringify(makePacket("milestone", "getMilestones", metaData));
    getSocket(userId).send(sendData);
}
function createMilestone(userId: string, milestoneData: TMilestoneData) {
    const milestoneUUID = DataMilestoneManager.create(milestoneData);
    const sendData = JSON.stringify(makePacket("milestone", "createMilestone", milestoneUUID ? { code: ResponseCode.ok, uuid: milestoneUUID } : { code: ResponseCode.internalError }));
    getSocket(userId).send(sendData);
}
function updateMilestone(userId: string, milestoneData: TMilestoneData) {
    const sendData = JSON.stringify(makePacket("milestone", "createMilestone", DataMilestoneManager.update(milestoneData) ? { code: ResponseCode.ok } : { code: ResponseCode.internalError }));
    getSocket(userId).send(sendData);
}
function deleteMilestone(userId: string, mileStoneUUID: string) {
    const sendData = JSON.stringify(makePacket("milestone", "createMilestone", DataMilestoneManager.delete(mileStoneUUID) ? { code: ResponseCode.ok } : { code: ResponseCode.internalError }));
    getSocket(userId).send(sendData);
}

export default function milestone(userId: string, packet: TSocketPacket) {
    milestoneLoadFuncs[packet.type](userId, packet.data);
}
