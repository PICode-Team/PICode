import { ResponseCode } from "../../constants/response";
import { TMilestoneCreateData, TMilestoneData, TMilestoneUpdateData } from "../../types/module/data/milestone.types";
import { TSocketPacket } from "../../types/module/socket.types";
import DataMilestoneManager from "../data/milestoneManager";
import { getSocket, makePacket } from "./manager";

const milestoneLoadFuncs: { [key in string]: (userId: string, mileStoneData: any) => void } = {
    getMilestone,
    createMilestone,
    updateMilestone,
    deleteMilestone,
};

function getMilestone(userId: string, options?: Partial<TMilestoneData>) {
    const metaData = DataMilestoneManager.get(options);
    const sendData = JSON.stringify(makePacket("milestone", "getMilestone", metaData));
    getSocket(userId).send(sendData);
}
function createMilestone(userId: string, milestoneData: TMilestoneCreateData) {
    const milestoneUUID = DataMilestoneManager.create(milestoneData);
    const sendData = JSON.stringify(makePacket("milestone", "createMilestone", milestoneUUID ? { code: ResponseCode.ok, uuid: milestoneUUID } : { code: ResponseCode.internalError }));
    getSocket(userId).send(sendData);
}
function updateMilestone(userId: string, { milestoneUUID, milestoneData }: { milestoneUUID: string; milestoneData: TMilestoneUpdateData }) {
    const sendData = JSON.stringify(
        makePacket("milestone", "updateMilestone", DataMilestoneManager.update(milestoneUUID, milestoneData) ? { code: ResponseCode.ok } : { code: ResponseCode.internalError })
    );
    getSocket(userId).send(sendData);
}
function deleteMilestone(userId: string, mileStoneData: Pick<TMilestoneData, "uuid">) {
    const sendData = JSON.stringify(makePacket("milestone", "deleteMilestone", DataMilestoneManager.delete(mileStoneData.uuid) ? { code: ResponseCode.ok } : { code: ResponseCode.internalError }));
    getSocket(userId).send(sendData);
}

export default function issue(userId: string, packet: TSocketPacket) {
    milestoneLoadFuncs[packet.type](userId, packet.data);
}
