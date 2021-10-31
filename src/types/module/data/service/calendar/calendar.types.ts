export interface TScheduleCreateData {
    type: "private" | "public";
    title: string;
    content?: string;
    startDate: string;
    dueDate: string;
    milestone?: string;
    kanban?: string;
    creator: string;
    assigner: string[];
    issue?: string;
}

export type TScheduleData = TScheduleCreateData & {
    scheduleId: string;
};

export type TCalendarData = Record<string, TScheduleData[]>;
