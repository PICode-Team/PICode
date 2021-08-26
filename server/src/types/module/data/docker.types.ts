export interface TDockerCreateData {
    containerName: string;
    image: string;
    tag?: string | "latest";
    bridgeName?: string;
    bridgeAlias?: string;
}

export type TBridgeInfo = {
    [key in string]: string | undefined;
};

export type TDockerUpdateData = Pick<Partial<TDockerCreateData>, "containerName" | "bridgeName" | "bridgeAlias"> & { connect?: boolean };

export type TDockerData = Pick<TDockerCreateData, "containerName" | "image" | "tag"> & {
    containerId: string;
    status: "created" | "running" | "exited";
    bridgeInfo: TBridgeInfo;
};

export type TDockerNetworkCreateData = {
    networkName: string;
    subnet?: string;
    ipRange?: string;
    gateway?: string;
};

export type TDockerNetworkData = TDockerNetworkCreateData & {
    id: string;
};

export type TDockerNetworkJsonData = {
    [key in string]: TDockerNetworkData;
};
