export interface TMilestoneData {
    uuid: string;
    title: string;
    content?: string;
    startDate: string;
    endDate: string;
}

export type TMilestoneCreateData = TMilestoneData & { kanban?: string };
export type TMilestoneUpdateData = Partial<TMilestoneData> & { kanban?: string };

export type TMilestoneJsonData = {
    [key in string]: TMilestoneData;
};
