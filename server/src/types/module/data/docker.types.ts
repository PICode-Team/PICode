export interface TDockerCreateData {
    containerName: string;
    image: string;
    tag?: string | "latest";
    bridgeName?: string;
    bridgeAlias?: string;
    hostPort?: number;
    containerPort?: number;
    linkContainer?: string;
}

export type TBridgeInfo = {
    [key in string]: string | undefined;
};

export type TDockerUpdateData = Pick<Partial<TDockerCreateData>, "containerName" | "bridgeName" | "bridgeAlias" | "linkContainer"> & { connect?: boolean };

export type TDockerData = Omit<TDockerCreateData, "linkContainer" | "bridgeName" | "bridgeAlias"> & {
    containerId: string;
    status: "created" | "running" | "exited";
    bridgeInfo: TBridgeInfo;
    ramUsage?: string;
    containers: string[];
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

export type TDockerVisualData = {
    node: TDockerNodeData[];
    edge: TDockerEdgeData[];
};

export type TDockerNodeData = Pick<TDockerData, "containerId" | "image" | "tag" | "status" | "ramUsage"> & { source: string };
export type TDockerEdgeData = Pick<TDockerData, "containerId" | "bridgeInfo" | "hostPort" | "containerPort"> & { target: string[] };
