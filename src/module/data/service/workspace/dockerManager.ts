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
} from "../../../../types/module/data/service/workspace/docker.types";
import path from "path";
import DataWorkspaceManager from "./workspaceManager";
import log from "../../../log";
import os from "os";
import fs from "fs";
import { getJsonData, isExists, removeData, setJsonData } from "../etc/fileManager";
import { DataDirectoryPath, TReturnData } from "../../../../types/module/data/data.types";
import DataAlarmManager from "../alarm/alarmManager";
import { ResponseCode } from "../../../../constants/response";

const dockerNetworkFileName = "dockerNetworkList.json";

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
        dockerNetworkJsonData[dockerNetworkInfo.networkId] = dockerNetworkInfo;

        const defaultPath = this.getDockerNetworkPath();
        const networkFilePath = `${defaultPath}/${dockerNetworkFileName}`;
        return setJsonData(networkFilePath, dockerNetworkJsonData);
    }

    static runDockerCommandSync(command: string) {
        const shell = os.platform() === "win32" ? "powershell.exe" : "bash";
        const commandDocker = spawnSync(shell, [command]);
        return commandDocker.stdout.toString().replace(/\n/gi, "");
    }

    static runDockerCommand(command: string, stdout: (result: Buffer) => void, stderr: (error: any) => void, close: (code: any) => void = () => {}) {
        const shell = os.platform() === "win32" ? "powershell.exe" : "bash";
        const commandDocker = spawn(shell, [command]);
        commandDocker.stdout.on("data", stdout);
        commandDocker.stderr.on("data", stderr);
        if (close !== undefined) {
            commandDocker.on("close", close);
        }
        return commandDocker;
    }

    static updateRamUsage() {
        fs.readdirSync(DataWorkspaceManager.getWorkspaceDefaultPath()).map((workspaceId) => {
            const dockerInfo = isExists(this.getDockerPath(workspaceId, "dockerInfo.json")) ? this.getDockerInfo(workspaceId) : undefined;
            if (dockerInfo !== undefined) {
                const getRam = this.runDockerCommand(
                    `docker stats --format "{{.MemPerc}}" ${dockerInfo.containerName}`,
                    (result: Buffer) => {
                        const ramUsage = result.toString("utf8").replace(/\n/gi, ""); //result.toString("utf8").replace(/\n/gi, "").split(`\u001b[2J`).join("").replace(`\u001B[H`, "");
                        if (ramUsage.length > 0) {
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
        ["host", "bridge", "none"].map((networkName) => {
            const command = `docker network inspect --format="{{".IPAM.Config"}} {{.Id}}" ${networkName}`;
            this.runDockerCommand(
                command,
                (result: Buffer) => {
                    const networkInfo = result.toString().replace(/\n/gi, "").split(" ");

                    networkInfo?.[0] === "[]"
                        ? this.setDockerNetWorkInfo({
                              name: networkName,
                              networkId: networkInfo?.[1],
                          })
                        : networkInfo?.[1] !== undefined
                        ? this.setDockerNetWorkInfo({
                              name: networkName,
                              subnet: networkInfo?.[1].split(":")[1].replace(/]/gi, ""),
                              gateway: networkInfo?.[0].split(":")[1],
                              networkId: networkInfo?.[2],
                          })
                        : undefined;
                },
                (error) => {
                    log.error(error);
                }
            );
        });
    }

    static updateStatus() {
        fs.readdirSync(DataWorkspaceManager.getWorkspaceDefaultPath()).map((workspaceId) => {
            const dockerInfo = isExists(this.getDockerPath(workspaceId, "dockerInfo.json")) ? this.getDockerInfo(workspaceId) : undefined;
            if (dockerInfo !== undefined) {
                this.setDockerInfo(workspaceId, {
                    ...dockerInfo,
                    status: this.runDockerCommandSync(`docker inspect --format="{{.State.Status}}" ${dockerInfo.containerName}`) as "created" | "running" | "exited",
                    containerIP: this.runDockerCommandSync(`docker inspect --format="{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}" ${dockerInfo.containerName}`),
                });
            }
        });
    }

    static getNetworkById(networkId?: string) {
        const dockerNetworkJsonData = this.getDockerNetworkInfo() ? (this.getDockerNetworkInfo() as TDockerNetworkJsonData) : ({} as TDockerNetworkJsonData);
        return Object.values(dockerNetworkJsonData).filter((networkInfo) => {
            return networkId === undefined || networkInfo.networkId === networkId;
        });
    }

    static getNetworkByName(networkName?: string) {
        const dockerNetworkJsonData = this.getDockerNetworkInfo() ? (this.getDockerNetworkInfo() as TDockerNetworkJsonData) : ({} as TDockerNetworkJsonData);
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

        this.runDockerCommand(
            command,
            (networkId: Buffer) => {
                const networkInfo = this.runDockerCommandSync(`docker network inspect --format="{{".IPAM.Config"}} {{".Containers"}}" ${dockerNetworkInfo.name}`).split(" ");
                log.debug(`create network result: ${networkInfo}`);
                this.setDockerNetWorkInfo({
                    ...dockerNetworkInfo,
                    subnet: networkInfo[0].replace("[{", ""),
                    ipRange: networkInfo[1],
                    gateway: networkInfo[2],
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
                delete dockerNetworkJsonData[networkId];
                const networkFilePath = `${this.getDockerNetworkPath()}/${dockerNetworkFileName}`;
                setJsonData(networkFilePath, dockerNetworkJsonData);
            },
            (error) => {
                log.error(error);
            }
        );
        return { code: ResponseCode.ok };
    }

    static getDockerPath(workspaceId: string, type: undefined | "dockerInfo.json" = undefined) {
        return type === undefined ? DataWorkspaceManager.getWorkspaceDataPath(workspaceId) : `${DataWorkspaceManager.getWorkspaceDataPath(workspaceId)}/${type}`;
    }
    static getDockerInfo(workspaceId: string) {
        return getJsonData(this.getDockerPath(workspaceId, "dockerInfo.json"));
    }

    static setDockerInfo(workspaceId: string, dockerInfo: TDockerData) {
        return setJsonData(this.getDockerPath(workspaceId, "dockerInfo.json"), dockerInfo);
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
        { workspaceId, workspaceName, workspaceParticipants }: { workspaceId: string; workspaceName: string; workspaceParticipants: string[] }
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
        { workspaceId, workspaceName, workspaceParticipants }: { workspaceId: string; workspaceName: string; workspaceParticipants: string[] }
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
        { workspaceId, workspaceName, workspaceParticipants }: { workspaceId: string; workspaceName: string; workspaceParticipants: string[] }
    ) {
        const tag = dockerInfo.tag ?? "latest";
        const workspacePath = DataWorkspaceManager.getWorkspaceWorkPath(workspaceId);
        const containerName = dockerInfo.containerName ?? workspaceName;

        let command = `docker run -itd --volume="${path.resolve(path.normalize(workspacePath))}:/home/${workspaceName}" -w /home/${workspaceName} `;
        if (dockerInfo.portInfo !== undefined) {
            Object.keys(dockerInfo.portInfo).map((hostPort: string) => {
                command += `-p ${hostPort}:${(dockerInfo.portInfo as TPortMappingData)[hostPort]} `;
            });
        }
        if (dockerInfo.linkContainer !== undefined) {
            const linkworkspaceId = fs.readdirSync(DataWorkspaceManager.getWorkspaceDefaultPath()).find((Id) => {
                return Id !== workspaceId && (this.getDockerInfo(Id) as TDockerData).containerName === dockerInfo.linkContainer;
            });
            if (linkworkspaceId !== undefined) {
                const linkContainerInfo = this.getDockerInfo(linkworkspaceId) as TDockerData;
                linkContainerInfo.containers.push(containerName);
                this.setDockerInfo(linkworkspaceId, linkContainerInfo);
                const bridgeName =
                    dockerInfo.bridgeName !== undefined && Object.keys(linkContainerInfo.bridgeInfo).includes(dockerInfo.bridgeName)
                        ? dockerInfo.bridgeName
                        : Object.keys(linkContainerInfo.bridgeInfo)[0];

                dockerInfo.bridgeName = bridgeName;
                command += `--net ${bridgeName} `;

                command += `--link ${dockerInfo.linkContainer}:${dockerInfo.linkContainer} `;
                command += dockerInfo.bridgeAlias !== undefined && !["bridge", "host", "none"].includes(bridgeName) ? `--net-alias ${dockerInfo.bridgeAlias} ` : ``;
            }
        }

        if (dockerInfo.linkContainer === undefined) {
            command += dockerInfo.bridgeName ? `--net ${dockerInfo.bridgeName} ` : ``;
            command += dockerInfo.bridgeName && dockerInfo.bridgeAlias && !["bridge", "host", "none"].includes(dockerInfo.bridgeName) ? `--net-alias ${dockerInfo.bridgeAlias} ` : ``;
        }

        command += `--name ${containerName} ${dockerInfo.image}:${dockerInfo.tag ?? "latest"}`;

        this.runDockerCommand(
            command,
            (containerId: Buffer) => {
                const bridgeInfo: TBridgeInfo = {};
                bridgeInfo[dockerInfo.bridgeName ?? "bridge"] = dockerInfo.bridgeAlias ? dockerInfo.bridgeAlias : "";
                this.setDockerInfo(workspaceId, {
                    containerName: containerName,
                    image: dockerInfo.image,
                    tag: tag,
                    containerId: containerId.toString().replace("\n", ""),
                    status: this.runDockerCommandSync(`docker inspect --format="{{.State.Status}}" ${containerName}`) as "created" | "running" | "exited",
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
            return this.getDockerInfo(workspaceId).containerId === containerId && DataWorkspaceManager.canEditWorkspace(userId, workspaceId, true);
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
                const state = this.runDockerCommandSync(`docker inspect --format="{{.State.Status}}" ${dockerInfo.containerName}`) as "created" | "running" | "exited";
                if (this.setDockerInfo(workspaceId, { ...dockerInfo, status: state })) {
                    log.error(`[DataDockerManager] manage -> fail to setDockerInfo`);
                }
                DataAlarmManager.create(userId, {
                    type: "workspace",
                    location: "",
                    content: `${userId} commands ${dockerCommand} to ${dockerInfo.containerName}`,
                    checkAlarm: (DataWorkspaceManager.getWorkspaceInfo(workspaceId)?.participants as string[]).reduce((list: { [ket in string]: boolean }, member) => {
                        list[member] = true;
                        return list;
                    }, {}),
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

        if (dockerInfo.bridgeName !== undefined && Object.keys(newDockerInfo.bridgeInfo).includes(dockerInfo.bridgeName) && dockerInfo.connect === false) {
            updateOption.disconnect = true;
            this.runDockerCommand(
                `docker network disconnect ${dockerInfo.bridgeName} ${newDockerInfo.containerName}`,
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

        if (dockerInfo.linkContainer !== undefined && dockerInfo.bridgeName !== undefined && !newDockerInfo.containers.includes(dockerInfo.linkContainer) && dockerInfo.connect === true) {
            const linkworkspaceId = fs.readdirSync(DataWorkspaceManager.getWorkspaceDefaultPath()).find((id) => {
                return id !== workspaceId && (this.getDockerInfo(id) as TDockerData).containerName === dockerInfo.linkContainer;
            });
            if (linkworkspaceId !== undefined) {
                updateOption.link = true;
                let command = `docker network connect --link ${dockerInfo.linkContainer} `;
                command += dockerInfo.bridgeAlias ? `--alias ${dockerInfo.bridgeAlias} ` : ``;
                command += `${dockerInfo.bridgeName} ${newDockerInfo.containerName}`;

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

        if (dockerInfo.bridgeName !== undefined && dockerInfo.linkContainer === undefined && !Object.keys(newDockerInfo.bridgeInfo).includes(dockerInfo.bridgeName) && dockerInfo.connect === true) {
            updateOption.connect = true;
            let command = `docker network connect `;
            command += dockerInfo.bridgeAlias ? `--alias ${dockerInfo.bridgeAlias} ` : ``;
            command += `${dockerInfo.bridgeName} ${newDockerInfo.containerName}`;

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

        updateOption.disconnect ? delete newDockerInfo.bridgeInfo[dockerInfo.bridgeName as string] : undefined;
        updateOption.connect ? (newDockerInfo.bridgeInfo[dockerInfo.bridgeName as string] = dockerInfo.bridgeAlias ?? "") : undefined;
        updateOption.link ? ((newDockerInfo.bridgeInfo[dockerInfo.bridgeName as string] = dockerInfo.bridgeAlias ?? ""), newDockerInfo.containers.push(dockerInfo.linkContainer as string)) : undefined;
        updateOption.rename ? (newDockerInfo.containerName = dockerInfo.containerName ?? newDockerInfo.containerName) : undefined;

        log.info(`docker update complete ${JSON.stringify({ newDockerInfo })}`);
        DataAlarmManager.create(userId, {
            type: "workspace",
            location: "",
            content: `${userId} update ${workspaceId} : ${dockerInfo.containerName} infomation`,
            checkAlarm: (DataWorkspaceManager.getWorkspaceInfo(workspaceId)?.participants as string[]).reduce((list: { [ket in string]: boolean }, member) => {
                list[member] = true;
                return list;
            }, {}),
        });
        return setJsonData(this.getDockerPath(workspaceId, "dockerInfo.json"), newDockerInfo) ? true : false;
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
                            checkAlarm: (DataWorkspaceManager.getWorkspaceInfo(workspaceId)?.participants as string[]).reduce((list: { [ket in string]: boolean }, member) => {
                                list[member] = true;
                                return list;
                            }, {}),
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

            visualizationInfo.container.push({
                ...dockerInfo,
                parent: Object.keys(dockerInfo.bridgeInfo).reduce((networkIdList: string[], bridgeName: string) => {
                    networkIdList.push((this.getDockerNetworkInfo() as TDockerNetworkJsonData)[bridgeName].networkId);
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
                containers: fs.readdirSync(DataWorkspaceManager.getWorkspaceDefaultPath()).reduce((containerIdList: string[], workspaceId: string) => {
                    const dockerInfo = this.getDockerInfo(workspaceId) as TDockerData;
                    Object.keys(dockerInfo.bridgeInfo).includes(networkInfo.name) ? containerIdList.push(dockerInfo.containerId) : undefined;
                    return containerIdList;
                }, []),
            } as TDockerNetworkVisualData;
            visualizationInfo.network.push(newNetworkInfo);
        });

        return visualizationInfo;
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
