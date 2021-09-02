import { TSocketPacket } from "../../types/module/socket.types";
import DataDockerManager from "../data/dockerManager";
import { getSocket, makePacket } from "./manager";

const dockerLoadFuncs: { [key in string]: (userId: string, data: any) => void } = {
    getVisualInfo: getVisualInfo,
};

function getVisualInfo(userId: string) {
    const sendData = makePacket("docker", "getVisualInfo", DataDockerManager.getDockerVisualizationInfo());
    getSocket(userId).send(JSON.stringify(sendData));
}

export default function docker(userId: string, packet: TSocketPacket) {
    dockerLoadFuncs[packet.type](userId, packet.data);
}
