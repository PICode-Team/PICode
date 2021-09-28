export interface TScheduleCreateData {
    type: "private" | "public";
    title: string;
    content?: string;
    startDate: string;
    dueDate: string;
    milestone?: string;
    creator: string;
    issue?: string;
}

export type TScheduleData = TScheduleCreateData & {
    scheduleId: string;
};

export type TCalendarData = Record<string, TScheduleData[]>;
