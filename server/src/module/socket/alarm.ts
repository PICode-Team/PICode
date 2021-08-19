import { TAlarmSet } from "../../types/module/data/alarm.types";
import { TSocketPacket } from "../../types/module/socket.types";
import DataAlarmManager from "../data/alarmManager";
import { getSocket, makePacket } from "./manager";

const alaramFunc: { [key in string]: (userId: string, packet: any) => void } = {
    getAlarmData, checkAlarm, createAlarm
}

function getAlarmData(userId: string, _packet: any) {
    const sendData = JSON.stringify(makePacket('alarm', 'getAlarm', DataAlarmManager.get(userId)))
    getSocket(userId)?.send(sendData)
}

function checkAlarm(userId: string, packet: any) {
    DataAlarmManager.checkAlarm(userId, packet.alarmRoom, packet.alarmId)
    const sendData = JSON.stringify(makePacket('alarm', 'checkAlarm', packet))
    getSocket(userId)?.send(sendData)
}

function createAlarm(userId: string, packet: Omit<TAlarmSet, 'userId' | 'alarmId'>) {
    DataAlarmManager.create(userId, packet)
    const sendData = JSON.stringify(makePacket('alarm', 'createAlarm', packet))
    getSocket(userId)?.send(sendData)
}

export default function alarm(userId: string, packet: TSocketPacket) {
    alaramFunc[packet.type](userId, packet.data)
}