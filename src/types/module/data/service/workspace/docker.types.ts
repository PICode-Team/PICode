export interface TDockerCreateData {
    containerName: string;
    image: string;
    tag?: string | "latest";
    bridgeId?: string;
    bridgeAlias?: string;
    portInfo?: TPortMappingData;
    linkContainer?: string;
}

export type TPortMappingData = {
    [key in string]: number;
};

export type TBridgeInfo = {
    [key in string]: string | undefined;
};

export type TDockerUpdateData = Pick<Partial<TDockerCreateData>, "containerName" | "bridgeId" | "bridgeAlias" | "linkContainer"> & { connect?: boolean };

export type TDockerData = Omit<TDockerCreateData, "linkContainer" | "bridgeName" | "bridgeAlias"> & {
    containerId: string;
    status: "created" | "running" | "exited";
    bridgeInfo: TBridgeInfo;
    ramUsage?: string;
    containers: string[];
    socketPort?: number;
    containerIP?: string;
};

export type TDockerNetworkCreateData = {
    name: string;
    subnet?: string;
    ipRange?: string;
    gateway?: string;
};

export type TDockerNetworkData = TDockerNetworkCreateData & {
    networkId: string;
};

export type TDockerNetworkJsonData = {
    [key in string]: TDockerNetworkData;
};

export type TDockerVisualData = {
    container: (TDockerData & { parent?: string[] })[];
    port: TDockerPortVisualData[];
    network: TDockerNetworkVisualData[];
};

export type TDockerPortVisualData = {
    outBound?: number;
    inBound?: number[];
    onContainer?: string;
    connectedContainers?: string[];
};
export type TDockerNetworkVisualData = {
    name: string;
    subnet?: string;
    ip?: string;
    networkId?: string;
    containers?: string[];
};
