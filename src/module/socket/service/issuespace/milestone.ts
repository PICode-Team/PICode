import {
    TMilestoneCreateData,
    TMilestoneData,
    TMilestoneUpdateData,
} from "../../../../types/module/data/service/issuespace/milestone.types";
import { TSocketPacket } from "../../../../types/module/socket.types";
import DataMilestoneManager from "../../../data/service/issuespace/milestoneManager";
import { getSocket, makePacket } from "../etc/manager";

const milestoneLoadFuncs: Record<string, (userId: string, mileStoneData: any) => void> = {
    getMilestone,
    createMilestone,
    updateMilestone,
    deleteMilestone,
};

function getMilestone(userId: string, options?: Partial<TMilestoneData>) {
    const metaData = DataMilestoneManager.get(options);
    const sendData = makePacket("milestone", "getMilestone", metaData);
    getSocket(userId).send(sendData);
}
function createMilestone(userId: string, milestoneData: TMilestoneCreateData) {
    const metaData = DataMilestoneManager.create(userId, milestoneData);
    const sendData = makePacket("milestone", "createMilestone", metaData);
    getSocket(userId).send(sendData);
}
function updateMilestone(userId: string, milestoneData: TMilestoneUpdateData) {
    const metaData = DataMilestoneManager.update(userId, milestoneData.uuid, milestoneData);
    const sendData = makePacket("milestone", "updateMilestone", metaData);
    getSocket(userId).send(sendData);
}
function deleteMilestone(userId: string, mileStoneData: Pick<TMilestoneData, "uuid">) {
    const metaData = DataMilestoneManager.delete(userId, mileStoneData.uuid);
    const sendData = makePacket("milestone", "deleteMilestone", metaData);
    getSocket(userId).send(sendData);
}

export default function milestone(userId: string, packet: TSocketPacket) {
    milestoneLoadFuncs[packet.type](userId, packet.data);
}
