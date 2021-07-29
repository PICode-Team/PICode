export interface TUserMouse {
    x: number;
    y: number;
}

export interface TWorkInfo {
    workingPath: string;
    userMouse?: TUserMouse;
}

export interface TUserToWork {
    userId: string;
    workInfo: TWorkInfo;
}

export type TUserWorkInfo = {
    [key in string]: TWorkInfo;
};
