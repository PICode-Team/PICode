export interface TAlarmSet {
    alarmId: string
    userId: string
    type: string
    location: string
    content: string
    checkAlarm: {
        [key in string]: boolean
    }
}

export interface TAlarmFullSet extends TAlarmSet {
    alarmRoom: string
}