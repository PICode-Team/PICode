import { spawn, spawnSync } from "child_process";
import {
    TDockerData,
    TDockerCreateData,
    TDockerNetworkJsonData,
    TDockerNetworkData,
    TDockerNetworkCreateData,
    TBridgeInfo,
    TDockerUpdateData,
    TDockerVisualData,
    TDockerPortVisualData,
    TDockerNetworkVisualData,
    TPortMappingData,
} from "../../../types/module/data/service/workspace/docker.types";
import path from "path";
import DataWorkspaceManager from "./workspaceManager";
import log from "../../log";
import os from "os";
import fs from "fs";
import { getJsonData, isExists, removeData, setJsonData } from "../etc/fileManager";
import { DataDirectoryPath, ExportDirectoryPath, TReturnData } from "../../../types/module/data/data.types";
import DataAlarmManager from "../alarm/alarmManager";
import { ResponseCode } from "../../../constants/response";

const dockerNetworkFileName = "dockerNetworkList.json";
const dockerInfoFileName = "dockerInfo.json";
const defaultNetwork = ["host", "bridge", "none"];

export default class DataDockerManager {
    static getDockerNetworkPath() {
        return `${DataDirectoryPath}/network`;
    }

    static getDockerNetworkInfo() {
        const defaultPath = this.getDockerNetworkPath();
        const networkFilePath = `${defaultPath}/${dockerNetworkFileName}`;

        if (!isExists(networkFilePath)) {
            return undefined;
        }
        return getJsonData(networkFilePath) as TDockerNetworkJsonData;
    }

    static setDockerNetWorkInfo(dockerNetworkInfo: TDockerNetworkData) {
        const dockerNetworkJsonData = this.getDockerNetworkInfo() ?? {};
        dockerNetworkJsonData[dockerNetworkInfo.name] = dockerNetworkInfo;

        const defaultPath = this.getDockerNetworkPath();
        const networkFilePath = `${defaultPath}/${dockerNetworkFileName}`;
        return setJsonData(networkFilePath, dockerNetworkJsonData);
    }

    static getSpawnParams(command: string) {
        if (os.platform() === 'win32') {
            return { mainCommand: 'powershell.exe', subCommand: [command] };
        }

        const splitData = command.split(' ');
        return { mainCommand: splitData?.[0], subCommand: splitData?.slice(1) }
    }

    static runDockerCommandSync(command: string) {
        const params = this.getSpawnParams(command);
        const commandDocker = spawnSync(params.mainCommand, params.subCommand);
        return commandDocker.stdout.toString().replace(/\n/gi, "");
    }

    static runDockerCommand(
        command: string,
        stdout: (result: Buffer) => void,
        stderr: (error: any) => void,
        close: (code: any) => void = () => {}
    ) {
        const params = this.getSpawnParams(command);
        const commandDocker = spawn(params.mainCommand, params.subCommand);
        commandDocker.stdout.on("data", stdout);
        commandDocker.stderr.on("data", stderr);
        if (close !== undefined) {
            commandDocker.on("close", close);
        }
        return commandDocker;
    }

    static updateRamUsage() {
        fs.readdirSync(DataWorkspaceManager.getWorkspaceDefaultPath()).map((workspaceId) => {
            const dockerInfo = this.getDockerInfo(workspaceId) ? this.getDockerInfo(workspaceId) : undefined;
            if (dockerInfo !== undefined) {
                const getRam = this.runDockerCommand(
                    `docker stats --format "{{.MemPerc}}" ${dockerInfo.containerName}`,
                    (result: Buffer) => {
                        const ramUsage = result
                            ?.toString("utf8")
                            ?.replace(/\n/gi, "")
                            ?.split("%")
                            ?.filter((v) => v?.length > 0)
                            ?.map((v) => v?.split("H")?.[1])
                            ?.slice(-1)
                            ?.pop();

                        if (ramUsage?.length > 0) {
                            this.setDockerInfo(workspaceId, { ...dockerInfo, ramUsage });
                            getRam.stdout.pause();
                            getRam.kill();
                        }
                    },
                    (error) => {
                        log.error(error);
                    }
                );
            }
        });
    }

    static getDefaultNetwork() {
        if (!isExists(this.getDockerNetworkPath())) {
            fs.mkdirSync(this.getDockerNetworkPath(), { recursive: true });
        }
        defaultNetwork.map((networkName) => {
            const command = `docker network inspect --format="{{".IPAM.Config"}}" ${networkName}`;
            this.runDockerCommand(
                command,
                (result: Buffer) => {
                    const networkInfo = result
                        .toString()
                        .replace(/\n/gi, "")
                        .replace(/\[/gi, "")
                        .replace(/\]/gi, "")
                        .replace(/\{/gi, "")
                        .replace(/\}/gi, "")
                        .split(" ");
                    this.setDockerNetWorkInfo({
                        name: networkName,
                        subnet: networkInfo?.[0]?.split(",")[0],
                        gateway: networkInfo?.[0]?.split(",")[1],
                        networkId: this.runDockerCommandSync(`docker network inspect --format="{{.Id}}" ${networkName}`),
                    });
                },
                (error) => {
                    log.error(error);
                }
            );
        });
    }

    static updateStatus() {
        fs.readdirSync(DataWorkspaceManager.getWorkspaceDefaultPath()).map((workspaceId) => {
            const dockerInfo = this.getDockerInfo(workspaceId) ? this.getDockerInfo(workspaceId) : undefined;
            if (dockerInfo !== undefined) {
                this.setDockerInfo(workspaceId, {
                    ...dockerInfo,
                    status: this.runDockerCommandSync(`docker inspect --format="{{.State.Status}}" ${dockerInfo.containerName}`) as
                        | "created"
                        | "running"
                        | "exited",
                    containerIP: this.runDockerCommandSync(
                        `docker inspect --format="{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}" ${dockerInfo.containerName}`
                    ),
                });
            }
        });
    }

    static getNetworkById(networkId?: string) {
        const dockerNetworkJsonData = this.getDockerNetworkInfo() ?? {};
        return Object.values(dockerNetworkJsonData).filter((networkInfo) => {
            return networkId === undefined || networkInfo.networkId === networkId;
        });
    }

    static getNetworkByName(networkName?: string) {
        const dockerNetworkJsonData = this.getDockerNetworkInfo() ?? {};
        return Object.values(dockerNetworkJsonData).filter((networkInfo) => {
            return networkName === undefined || networkInfo.name === networkName;
        });
    }

    static createNetwork(dockerNetworkInfo: TDockerNetworkCreateData): TReturnData {
        if (!isExists(this.getDockerNetworkPath())) {
            fs.mkdirSync(this.getDockerNetworkPath(), { recursive: true });
        }
        if (this.getNetworkByName(dockerNetworkInfo.name).length > 0) {
            log.error(`[DataDockerManager] createNetwork -> ${dockerNetworkInfo.name} is already exist`);
            return { code: ResponseCode.confilct, message: `${dockerNetworkInfo.name} is already exist` };
        }

        let command = `docker network create --driver=bridge `;
        command += dockerNetworkInfo.subnet ? `--subnet=${dockerNetworkInfo.subnet} ` : ``;
        command += dockerNetworkInfo.ipRange ? `--ip-range=${dockerNetworkInfo.ipRange} ` : ``;
        command += dockerNetworkInfo.gateway ? `--gateway=${dockerNetworkInfo.gateway} ` : ``;
        command += `${dockerNetworkInfo.name}`;

        log.debug(`command : ${command}`);
        this.runDockerCommand(
            command,
            (networkId: Buffer) => {
                const networkInfo = this.runDockerCommandSync(
                    `docker network inspect --format="{{".IPAM.Config"}} {{".Containers"}}" ${dockerNetworkInfo.name}`
                ).split(" ");
                log.debug(`create network result: ${networkInfo}`);
                this.setDockerNetWorkInfo({
                    ...dockerNetworkInfo,
                    subnet: networkInfo?.[0].replace("[{", ""),
                    ipRange: networkInfo?.[1],
                    gateway: networkInfo?.[2],
                    networkId: networkId.toString().replace("\n", ""),
                });
            },
            (error) => {
                log.error(error);
            }
        );
        return { code: ResponseCode.ok };
    }

    static deleteNetwork(networkId: string): TReturnData {
        this.runDockerCommand(
            `docker network rm ${networkId}`,
            () => {
                const dockerNetworkJsonData = this.getDockerNetworkInfo() as TDockerNetworkJsonData;
                const networkName = this.getNetworkById(networkId)?.[0].name;
                if (networkName === undefined) {
                    return { code: ResponseCode.invaildRequest, message: "Could not find network" };
                }
                delete dockerNetworkJsonData[networkName];
                const networkFilePath = `${this.getDockerNetworkPath()}/${dockerNetworkFileName}`;
                setJsonData(networkFilePath, dockerNetworkJsonData);
            },
            (error) => {
                log.error(error);
            }
        );
        return { code: ResponseCode.ok };
    }

    static getDockerPath(workspaceId: string) {
        return DataWorkspaceManager.getWorkspaceDataPath(workspaceId);
    }
    static getDockerInfo(workspaceId: string) {
        const defaultPath = this.getDockerPath(workspaceId);
        const dockerInfoPath = `${defaultPath}/${dockerInfoFileName}`;
        if (!isExists(dockerInfoPath)) {
            return undefined;
        }

        return getJsonData(dockerInfoPath);
    }

    static setDockerInfo(workspaceId: string, dockerInfo: TDockerData) {
        const defaultPath = this.getDockerPath(workspaceId);
        const dockerInfoPath = `${defaultPath}/${dockerInfoFileName}`;
        if (!isExists(defaultPath)) {
            return false;
        }

        return setJsonData(dockerInfoPath, dockerInfo);
    }

    static get(workspaceId?: string) {
        return fs
            .readdirSync(DataWorkspaceManager.getWorkspaceDefaultPath())
            .filter((Id) => {
                return workspaceId === undefined || Id === workspaceId;
            })
            .reduce((dockerInfoList: TDockerData[], workspaceId: string) => {
                dockerInfoList.push(this.getDockerInfo(workspaceId));
                return dockerInfoList;
            }, []);
    }

    static createPkgProgram(
        userId: string,
        dockerInfo: TDockerCreateData,
        {
            workspaceId,
            workspaceName,
            workspaceParticipants,
        }: { workspaceId: string; workspaceName: string; workspaceParticipants: string[] }
    ) {
        if (!fs.existsSync(`${DataDirectoryPath}/docker`)) {
            fs.mkdirSync(`${DataDirectoryPath}/docker`, { recursive: true });
        }
        if (!isExists(`${DataDirectoryPath}/docker/server-linux`)) {
            this.runDockerCommand(
                `pkg ${DataDirectoryPath}/docker/server.js --out-path ${DataDirectoryPath}/docker`,
                (result: Buffer) => {
                    log.debug(`createPkgProgram -> : ${result.toString()}`);
                },
                (error) => {
                    log.error(error);
                },
                (code) => {
                    log.debug(`code : ${code}`);
                    if (code === 0) {
                        this.createDockerFile(userId, dockerInfo, { workspaceId, workspaceName, workspaceParticipants });
                    }
                }
            );
        } else {
            this.createDockerFile(userId, dockerInfo, { workspaceId, workspaceName, workspaceParticipants });
        }
    }

    static createDockerFile(
        userId: string,
        dockerInfo: TDockerCreateData,
        {
            workspaceId,
            workspaceName,
            workspaceParticipants,
        }: { workspaceId: string; workspaceName: string; workspaceParticipants: string[] }
    ) {
        const socketPort = Math.floor(Math.random() * (49998 - 40000 + 1)) + 40000;
        let dockerFileContent = `FROM ${dockerInfo.image}:${dockerInfo.tag ?? "latest"}
        
COPY ./server-linux /server-linux
        
EXPOSE ${socketPort}

CMD ["./server-linux", "${socketPort}"]`;

        fs.writeFileSync(`${DataDirectoryPath}/docker/Dockerfile`, dockerFileContent);

        this.runDockerCommand(
            `docker build -t ${workspaceName.toLowerCase()}:latest ${DataDirectoryPath}/docker`,
            () => {},
            (result) => {
                log.debug(`dockerfile create result -> ${result}`);
            },
            (code) => {
                code === 0
                    ? this.create(userId, dockerInfo, { workspaceId, workspaceName, workspaceParticipants }) //, workspaceName.toLowerCase(), socketPort)
                    : DataAlarmManager.create(userId, {
                          type: "workspace",
                          location: "",
                          content: `${userId} could not create workspace : ${workspaceName}`,
                          checkAlarm: workspaceParticipants.reduce((list: { [ket in string]: boolean }, member) => {
                              list[member] = true;
                              return list;
                          }, {}),
                      });
            }
        );
    }

    static create(
        userId: string,
        dockerInfo: TDockerCreateData,
        {
            workspaceId,
            workspaceName,
            workspaceParticipants,
        }: { workspaceId: string; workspaceName: string; workspaceParticipants: string[] }
    ) {
        const tag = dockerInfo.tag ?? "latest";
        const workspacePath = DataWorkspaceManager.getWorkspaceWorkPath(workspaceId);
        const containerName = dockerInfo.containerName ?? workspaceName;

        let command = `docker run -itd --volume="${path.resolve(
            path.normalize(workspacePath)
        )}:/home/${workspaceName}" -w /home/${workspaceName} `;
        if (dockerInfo.portInfo !== undefined) {
            Object.keys(dockerInfo.portInfo).map((hostPort: string) => {
                command += `-p ${hostPort}:${(dockerInfo.portInfo as TPortMappingData)[hostPort]} `;
            });
        }
        if (dockerInfo.linkContainer !== undefined) {
            const linkworkspaceId = fs.readdirSync(DataWorkspaceManager.getWorkspaceDefaultPath()).find((Id) => {
                return Id !== workspaceId && (this.getDockerInfo(Id) as TDockerData)?.containerId === dockerInfo.linkContainer;
            });
            if (linkworkspaceId !== undefined) {
                const linkContainerInfo = this.getDockerInfo(linkworkspaceId) as TDockerData;
                linkContainerInfo?.containers.push(containerName);
                this.setDockerInfo(linkworkspaceId, linkContainerInfo);
                const bridgeId =
                    dockerInfo.bridgeId !== undefined && Object.keys(linkContainerInfo.bridgeInfo).includes(dockerInfo.bridgeId)
                        ? dockerInfo.bridgeId
                        : Object.keys(linkContainerInfo.bridgeInfo)[0];

                dockerInfo.bridgeId = bridgeId;
                command += `--net ${bridgeId} `;

                command += `--link ${dockerInfo.linkContainer} `;
                command +=
                    dockerInfo.bridgeAlias !== undefined && !["bridge", "host", "none"].includes(bridgeId)
                        ? `--net-alias ${dockerInfo.bridgeAlias} `
                        : ``;
            }
        } else {
            command += dockerInfo.bridgeId ? `--net ${dockerInfo.bridgeId} ` : ``;
            const bridgeId = this.getNetworkById(dockerInfo.bridgeId)[0]?.name;
            command +=
                dockerInfo.bridgeId && dockerInfo.bridgeAlias && !["bridge", "host", "none"].includes(bridgeId)
                    ? `--net-alias ${dockerInfo.bridgeAlias} `
                    : ``;
        }

        command += `--name ${containerName} ${dockerInfo.image}:${dockerInfo.tag ?? "latest"}`;

        this.runDockerCommand(
            command,
            (containerId: Buffer) => {
                const bridgeInfo: TBridgeInfo = {};
                bridgeInfo[dockerInfo.bridgeId ?? this.getNetworkByName("bridge")[0]?.networkId] = dockerInfo.bridgeAlias
                    ? dockerInfo.bridgeAlias
                    : "";
                this.setDockerInfo(workspaceId, {
                    containerName: containerName,
                    image: dockerInfo.image,
                    tag: tag,
                    containerId: containerId.toString().replace("\n", ""),
                    status: this.runDockerCommandSync(`docker inspect --format="{{.State.Status}}" ${containerName}`) as
                        | "created"
                        | "running"
                        | "exited",
                    bridgeInfo: bridgeInfo,
                    containers: dockerInfo.linkContainer ? [dockerInfo.linkContainer] : [],
                    portInfo: dockerInfo.portInfo,
                });

                DataAlarmManager.create(userId, {
                    type: "workspace",
                    location: `?workspace=${workspaceId}`,
                    content: `${userId} created workspace : ${workspaceName}`,
                    checkAlarm: workspaceParticipants.reduce((list: { [ket in string]: boolean }, member) => {
                        list[member] = true;
                        return list;
                    }, {}),
                });
                log.info(`Create docker container: ${containerId}`);
            },
            (error) => {
                log.error(`${error}`);
                if ((error.includes("Error") || error.includes("error")) && !error.includes("port")) {
                    removeData(DataWorkspaceManager.getWorkspaceWorkPath(workspaceId));
                    removeData(DataWorkspaceManager.getWorkspaceDataPath(workspaceId));
                    DataAlarmManager.create(userId, {
                        type: "workspace",
                        location: `/`,
                        content: `${userId} could not create workspace : ${workspaceName}, error is: ${error}`,
                        checkAlarm: workspaceParticipants.reduce((list: { [ket in string]: boolean }, member) => {
                            list[member] = true;
                            return list;
                        }, {}),
                    });
                }
            }
        );
    }

    static getworkspaceId(userId: string, containerId: string) {
        return fs.readdirSync(DataWorkspaceManager.getWorkspaceDefaultPath()).find((workspaceId) => {
            return (
                this.getDockerInfo(workspaceId)?.containerId === containerId &&
                DataWorkspaceManager.canEditWorkspace(userId, workspaceId, true)
            );
        });
    }

    static manage(userId: string, containerId: string, dockerCommand: "start" | "stop" | "restart" | "rm"): TReturnData {
        const workspaceId = this.getworkspaceId(userId, containerId);
        const dockerInfo = workspaceId ? this.getDockerInfo(workspaceId) : undefined;

        if (dockerInfo === undefined || workspaceId === undefined) {
            log.error(`[DataDockerManager] manage -> fail to getDockerInfo`);
            return { code: ResponseCode.invaildRequest, message: "Could not find workspace Info through containerId that you entered" };
        }

        this.runDockerCommand(
            `docker ${dockerCommand} ${dockerInfo.containerName}`,
            () => {
                const status = this.runDockerCommandSync(`docker inspect --format="{{.State.Status}}" ${dockerInfo.containerName}`) as
                    | "created"
                    | "running"
                    | "exited";

                if (!this.setDockerInfo(workspaceId, { ...dockerInfo, status })) {
                    log.error(`[DataDockerManager] manage -> fail to setDockerInfo`);
                    return { code: ResponseCode.internalError, message: "Failed to update docker infomation, but status update" };
                }
                DataAlarmManager.create(userId, {
                    type: "workspace",
                    location: "",
                    content: `${userId} commands ${dockerCommand} to ${dockerInfo.containerName}`,
                    checkAlarm: (DataWorkspaceManager.getWorkspaceInfo(workspaceId)?.participants as string[]).reduce(
                        (list: { [ket in string]: boolean }, member) => {
                            list[member] = true;
                            return list;
                        },
                        {}
                    ),
                });
            },
            (error) => {
                log.error(error);
            }
        );
        return { code: ResponseCode.ok };
    }

    static updateFromDocker(userId: string, containerId: string, dockerInfo: TDockerUpdateData) {
        const workspaceId = this.getworkspaceId(userId, containerId) as string;
        if (workspaceId === undefined) {
            return false;
        }
        return this.update(userId, workspaceId, dockerInfo);
    }

    static update(userId: string, workspaceId: string, dockerInfo: TDockerUpdateData) {
        const updateOption = { disconnect: false, connect: false, link: false, rename: false };
        const newDockerInfo = this.getDockerInfo(workspaceId) as TDockerData;
        if (newDockerInfo === undefined) {
            return false;
        }

        const networkInfo = this.getDockerNetworkInfo();
        const defaultNetworkIdList = defaultNetwork.map((networkName: string) => {
            return networkInfo[networkName].networkId;
        });
        if (defaultNetworkIdList.includes(dockerInfo.bridgeId)) {
            return false;
        }

        if (
            dockerInfo.bridgeId !== undefined &&
            Object.keys(newDockerInfo.bridgeInfo).includes(dockerInfo.bridgeId) &&
            dockerInfo.connect === false
        ) {
            updateOption.disconnect = true;
            this.runDockerCommand(
                `docker network disconnect ${dockerInfo.bridgeId} ${newDockerInfo.containerName}`,
                () => {},
                (error) => {
                    log.error(error);
                },
                (code) => {
                    if (code === 1) {
                    }
                }
            );
        }

        if (
            dockerInfo.linkContainer !== undefined &&
            dockerInfo.bridgeId !== undefined &&
            !newDockerInfo.containers.includes(dockerInfo.linkContainer) &&
            dockerInfo.connect === true
        ) {
            const linkworkspaceId = fs.readdirSync(DataWorkspaceManager.getWorkspaceDefaultPath()).find((id) => {
                return id !== workspaceId && (this.getDockerInfo(id) as TDockerData)?.containerId === dockerInfo.linkContainer;
            });
            if (linkworkspaceId !== undefined) {
                updateOption.link = true;
                let command = `docker network connect --link ${dockerInfo.linkContainer} `;
                command += dockerInfo.bridgeAlias ? `--alias ${dockerInfo.bridgeAlias} ` : ``;
                command += `${dockerInfo.bridgeId} ${newDockerInfo.containerName}`;

                this.runDockerCommand(
                    command,
                    () => {},
                    (error) => {
                        log.error(error);
                    },
                    (code: any) => {
                        if (code === 1) {
                        }
                    }
                );
            }
        }

        if (
            dockerInfo.bridgeId !== undefined &&
            dockerInfo.linkContainer === undefined &&
            !Object.keys(newDockerInfo.bridgeInfo).includes(dockerInfo.bridgeId) &&
            dockerInfo.connect === true
        ) {
            updateOption.connect = true;
            let command = `docker network connect `;
            command += dockerInfo.bridgeAlias ? `--alias ${dockerInfo.bridgeAlias} ` : ``;
            command += `${dockerInfo.bridgeId} ${newDockerInfo.containerName}`;

            this.runDockerCommand(
                command,
                () => {},
                (error) => {
                    log.error(error);
                },
                (code) => {
                    if (code === 1) {
                    }
                }
            );
        }

        if (dockerInfo.containerName !== undefined && newDockerInfo.containerName !== dockerInfo.containerName) {
            updateOption.rename = true;
            this.runDockerCommand(
                `docker rename ${newDockerInfo.containerName} ${dockerInfo.containerName}`,
                () => {},
                (error) => {
                    log.error(error);
                },
                (code) => {
                    if (code === 1) {
                    }
                }
            );
        }
        log.debug(`updateOption : ${JSON.stringify(updateOption)}`);
        updateOption.disconnect ? delete newDockerInfo.bridgeInfo[dockerInfo.bridgeId as string] : undefined;
        updateOption.connect ? (newDockerInfo.bridgeInfo[dockerInfo.bridgeId as string] = dockerInfo.bridgeAlias ?? "") : undefined;
        updateOption.link
            ? ((newDockerInfo.bridgeInfo[dockerInfo.bridgeId as string] = dockerInfo.bridgeAlias ?? ""),
              newDockerInfo.containers.push(dockerInfo.linkContainer as string))
            : undefined;
        updateOption.rename ? (newDockerInfo.containerName = dockerInfo.containerName ?? newDockerInfo.containerName) : undefined;

        log.info(`docker update complete ${JSON.stringify({ newDockerInfo })}`);
        DataAlarmManager.create(userId, {
            type: "workspace",
            location: "",
            content: `${userId} update ${workspaceId} : ${dockerInfo.containerName} infomation`,
            checkAlarm: (DataWorkspaceManager.getWorkspaceInfo(workspaceId)?.participants as string[]).reduce(
                (list: { [ket in string]: boolean }, member) => {
                    list[member] = true;
                    return list;
                },
                {}
            ),
        });
        return this.setDockerInfo(workspaceId, newDockerInfo) ? true : false;
    }

    static delete(userId: string, workspaceId: string) {
        const dockerInfo = workspaceId ? this.getDockerInfo(workspaceId) : undefined;
        if (dockerInfo === undefined || workspaceId === undefined) {
            log.error(`[DataDockerManager] manage -> fail to getDockerInfo`);
            return false;
        }
        this.runDockerCommand(
            `docker stop ${dockerInfo.containerName}`,
            () => {
                this.runDockerCommand(
                    `docker rm ${dockerInfo.containerName}`,
                    () => {
                        DataAlarmManager.create(userId, {
                            type: "workspace",
                            location: "",
                            content: `${userId} remove workspace : workspaceId ${workspaceId}, containerId ${dockerInfo.containerId}`,
                            checkAlarm: (DataWorkspaceManager.getWorkspaceInfo(workspaceId)?.participants as string[]).reduce(
                                (list: { [ket in string]: boolean }, member) => {
                                    list[member] = true;
                                    return list;
                                },
                                {}
                            ),
                        });
                        removeData(DataWorkspaceManager.getWorkspaceDataPath(workspaceId));
                    },
                    (error) => log.error(error)
                );
            },
            (error) => log.error(error)
        );

        return true;
    }

    static getDockerVisualizationInfo() {
        const visualizationInfo = { container: [], port: [], network: [] } as TDockerVisualData;
        fs.readdirSync(DataWorkspaceManager.getWorkspaceDefaultPath()).map((workspaceId) => {
            const dockerInfo = this.getDockerInfo(workspaceId) as TDockerData;
            if (dockerInfo === undefined) {
                return;
            }
            visualizationInfo.container.push({
                ...dockerInfo,
                parent: Object.keys(dockerInfo.bridgeInfo).reduce((networkIdList: string[], bridgeId: string) => {
                    networkIdList.push(bridgeId);
                    return networkIdList;
                }, []),
            });
            if (dockerInfo.portInfo !== undefined) {
                Object.keys(dockerInfo.portInfo as TPortMappingData).map((hostPortString: string) => {
                    const hostPort = parseInt(hostPortString, 10);
                    const containerPort = (dockerInfo.portInfo as TPortMappingData)[hostPortString];
                    const portInfoIndex = visualizationInfo.port.findIndex((portInfo: TDockerPortVisualData) => {
                        return portInfo.outBound === hostPort;
                    });
                    if (portInfoIndex !== -1) {
                        visualizationInfo.port[portInfoIndex].inBound?.push(containerPort);
                        dockerInfo.status === "running"
                            ? (visualizationInfo.port[portInfoIndex].onContainer = dockerInfo.containerId)
                            : visualizationInfo.port[portInfoIndex].connectedContainers?.push(dockerInfo.containerId);
                    } else {
                        const newPortInfo = {
                            outBound: hostPort,
                            inBound: [containerPort],
                            onContainer: dockerInfo.status === "running" ? dockerInfo.containerId : "",
                            connectedContainers: dockerInfo.status === "running" ? [] : [dockerInfo.containerId],
                        } as TDockerPortVisualData;
                        visualizationInfo.port.push(newPortInfo);
                    }
                });
            }
        });
        Object.values(this.getDockerNetworkInfo() as TDockerNetworkJsonData).map((networkInfo: TDockerNetworkData) => {
            const newNetworkInfo = {
                name: networkInfo.name,
                networkId: networkInfo.networkId,
                ip: networkInfo.subnet,
                containers: fs
                    .readdirSync(DataWorkspaceManager.getWorkspaceDefaultPath())
                    .reduce((containerIdList: string[], workspaceId: string) => {
                        const dockerInfo = this.getDockerInfo(workspaceId) as TDockerData;
                        Object.keys(dockerInfo?.bridgeInfo).includes(networkInfo.name)
                            ? containerIdList.push(dockerInfo?.containerId)
                            : undefined;
                        return containerIdList;
                    }, []),
            } as TDockerNetworkVisualData;
            visualizationInfo.network.push(newNetworkInfo);
        });

        return visualizationInfo;
    }

    static export(userId: string, { containerId, imageName, tagName }: { containerId: string; imageName: string; tagName: string }) {
        imageName = imageName ?? containerId;
        tagName = tagName ?? "latest";
        try {
            this.runDockerCommand(
                `docker commit ${containerId} ${imageName}:${tagName}`,
                () => {
                    this.runDockerCommand(
                        `docker save -o ${ExportDirectoryPath}/${imageName}.tar ${imageName}:${tagName}`,
                        () => {},
                        () => {},
                        (code) => {
                            code === 0
                                ? DataAlarmManager.create(userId, {
                                      type: "workspace",
                                      location: `/api/download/${imageName}.tar`,
                                      content: `Export workspace container complete`,
                                      checkAlarm: { [userId]: true },
                                  })
                                : DataAlarmManager.create(userId, {
                                      type: "workspace",
                                      location: ``,
                                      content: `Failed to export workspace container`,
                                      checkAlarm: { [userId]: true },
                                  });
                        }
                    );
                },
                (error) => {
                    log.error(error);
                }
            );
            return true;
        } catch (err) {
            log.error(err.stack);
            return false;
        }
    }

    static async run() {
        this.getDefaultNetwork();
        if (!fs.existsSync(DataWorkspaceManager.getWorkspaceDefaultPath())) {
            fs.mkdirSync(DataWorkspaceManager.getWorkspaceDefaultPath(), { recursive: true });
        }
        setInterval(() => {
            this.updateStatus();
            this.updateRamUsage();
        }, 5000);
    }
}
