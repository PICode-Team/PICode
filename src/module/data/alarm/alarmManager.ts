import { DataDirectoryPath } from "../../../types/module/data/data.types";
import { readdirSync, readFileSync, mkdirSync, writeFileSync, existsSync } from "fs";
import { v4 as uuidv4 } from "uuid";
import { TAlarmFullSet, TAlarmSet } from "../../../types/module/data/service/alarm/alarm.types";

export default class DataAlarmManager {
    private static getDefaultDataPath() {
        const defaultPath = `${DataDirectoryPath}/alarm`;

        if (!existsSync(defaultPath)) {
            mkdirSync(defaultPath, { recursive: true });
        }

        return defaultPath;
    }

    private static getAlarmFileList() {
        return readdirSync(this.getDefaultDataPath())
            .filter((v) => v !== "alarm_info.json")
            .reverse();
    }

    private static getAlarmData(alarmRoom: string) {
        return (JSON.parse(readFileSync(`${this.getDefaultDataPath()}/${alarmRoom}`).toString()) as TAlarmSet[]).map((v) => ({
            ...v,
            alarmRoom,
        })) as TAlarmFullSet[];
    }

    private static saveAlarmData(fileName: string, data: TAlarmFullSet[]) {
        writeFileSync(`${this.getDefaultDataPath()}/${fileName}`, JSON.stringify(data));
    }

    static getAllAlarm() {
        return this.getAlarmFileList()
            .map((v) => this.getAlarmData(v))
            .reduce((a, c) => {
                return a.concat(c);
            }, []);
    }

    static get(userId: string) {
        return this.getAllAlarm()
            .filter((v) => Object.keys(v.checkAlarm).indexOf(userId) > -1)
            .map((v) => {
                return { ...v, checkAlarm: v.checkAlarm[userId] };
            });
    }

    static create(userId: string, alarmData: Omit<TAlarmSet, "userId" | "alarmId">) {
        const alarmFileList = this.getAlarmFileList();

        const alarmObject = (() => {
            if (alarmFileList.length === 0) {
                return { fileNum: alarmFileList.length + 1, alarmList: [] };
            }

            const lastData = this.getAlarmData(alarmFileList[0]);
            if (lastData.length > 100) {
                return { fileNum: alarmFileList.length + 1, alarmList: [] };
            }

            return { fileNum: alarmFileList.length, alarmList: lastData };
        })();

        const alarmRoom = `alarm_${alarmObject.fileNum}.json`;
        const newAlarm: TAlarmFullSet = {
            alarmId: uuidv4(),
            alarmRoom,
            userId,
            ...alarmData,
        };

        this.saveAlarmData(alarmRoom, [newAlarm, ...alarmObject.alarmList]);
    }

    static checkAlarm(userId: string, alarmRoom: string, alarmId: string, alarmStatus: boolean = false) {
        const prevData = this.getAlarmData(alarmRoom);

        this.saveAlarmData(
            alarmRoom,
            prevData.map((v) => {
                if (v.alarmId === alarmId && Object.keys(v.checkAlarm).indexOf(userId) > -1) {
                    return {
                        ...v,
                        checkAlarm: { ...v.checkAlarm, [userId]: alarmStatus },
                    };
                }
                return v;
            })
        );
    }
}
