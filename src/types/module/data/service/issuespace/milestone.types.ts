import { TReturnData } from "../../data.types";

export interface TMilestoneData {
    uuid: string;
    title: string;
    content?: string;
    startDate: string;
    dueDate: string;
}

export type TMilestoneCreateData = TMilestoneData & { kanban?: string };
export type TMilestoneUpdateData = Partial<TMilestoneData> & { kanban?: string };

export type TMilestoneJsonData = {
    [key in string]: TMilestoneData;
};

export type TReturnMilestoneData = TReturnData & {
    uuid?: string;
};
