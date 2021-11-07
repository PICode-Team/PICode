import { TUserData } from "../src/types/module/data/service/user/user.types";
import { TDockerCreateData } from "../src/types/module/data/service/workspace/docker.types";
import { TWorkspaceCreateData } from "../src/types/module/data/service/workspace/workspace.type";
import DataUserManager from "../src/module/data/user/userManager";
export function getTestUser(userId: string): TUserData {
    return {
        userId,
        passwd: "1q2w3e4r",
        userName: "testUser",
        userThumbnail: undefined,
    };
}

export function createUser({ userId, userName, passwd }: TUserData) {
    return DataUserManager.create({ userId, userName, passwd, userThumbnail: undefined });
}

export function getTestWorkspaceInfo(workspaceName: string, userId: string): TWorkspaceCreateData {
    return {
        name: workspaceName,
        description: "this is test workspace",
    };
}

export function getTestDockerInfo(containerName?: string, portInfo?: Record<string, number>): TDockerCreateData {
    containerName = containerName ?? undefined;
    portInfo = portInfo ?? undefined;
    return {
        containerName,
        image: "ubuntu",
        tag: "latest",
        portInfo,
    };
}
