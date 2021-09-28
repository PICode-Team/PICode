import { TCalendarData, TScheduleCreateData, TScheduleData } from "../../types/module/data/service/calendar/calendar.types";
import { TSocketPacket } from "../../types/module/socket.types";
import DataCalendarManager from "../data/service/calendar/calendarManager";
import { getSocket, makePacket } from "./manager";

const calendarLoadFuncs: Record<string, (userId: string, scheduleData: any) => void> = {
    getCalendar: getCalendar,
    createCalendar: createSchedule,
    updateCalendar: updateSchedule,
    deleteCalendar: deleteSchedule,
};

function getCalendar(userId: string, options?: Partial<TScheduleData>) {
    const sendData = makePacket("calendar", "getCalendar", { schedules: DataCalendarManager.getCalendar(options) });
    getSocket(userId).send(sendData);
}

function createSchedule(userId: string, scheduleData: TScheduleCreateData) {
    const sendData = makePacket("calendar", "createSchedule", DataCalendarManager.createSchedule(scheduleData));
    getSocket(userId).send(sendData);
}

function updateSchedule(userId: string, scheduleData: Partial<TScheduleData>) {
    const sendData = makePacket("calendar", "updateSchedule", DataCalendarManager.updateSchedule(scheduleData));
    getSocket(userId).send(sendData);
}

function deleteSchedule(userId: string, scheduleData: Pick<TScheduleData, "scheduleId">) {
    const sendData = makePacket("calendar", "deleteSchedule", DataCalendarManager.deleteSchedule(scheduleData));
}

export default function calendar(userId: string, packet: TSocketPacket) {
    calendarLoadFuncs[packet.type](userId, packet.data);
}
