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
} from "../../types/module/data/docker.types";
import path from "path";
import DataProjectManager from "./projectManager";
import log from "../log";
import os from "os";
import fs from "fs";
import { getJsonData, isExists, removeData, setJsonData } from "./fileManager";
import { DataDirectoryPath } from "../../types/module/data/data.types";
import DataAlarmManager from "./alarmManager";

export default class DataDockerManager {
    static getDockerNetworkPath(type?: "dockerNetworkList.json") {
        return type ? `${DataDirectoryPath}/network/${type}` : `${DataDirectoryPath}/network`;
    }

    static getDockerNetworkInfo() {
        if (!isExists(this.getDockerNetworkPath("dockerNetworkList.json"))) {
            return undefined;
        }
        return getJsonData(this.getDockerNetworkPath("dockerNetworkList.json")) as TDockerNetworkJsonData;
    }

    static setDockerNetWorkInfo(dockerNetworkInfo: TDockerNetworkData) {
        const dockerNetworkJsonData = this.getDockerNetworkInfo() ? (this.getDockerNetworkInfo() as TDockerNetworkJsonData) : ({} as TDockerNetworkJsonData);

        dockerNetworkJsonData[dockerNetworkInfo.networkName] = dockerNetworkInfo;
        return setJsonData(this.getDockerNetworkPath("dockerNetworkList.json"), dockerNetworkJsonData) ? true : false;
    }

    static commandDockerSync(command: string) {
        const shell = os.platform() === "win32" ? "powershell.exe" : "bash";
        const commandDocker = spawnSync(shell, [command]);
        return commandDocker.stdout.toString().replace(/\n/gi, "");
    }

    static commandDockerAsync(command: string, stdout: (result: Buffer) => void, stderr: (error: any) => void, close?: (code: any) => void) {
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
        fs.readdirSync(DataProjectManager.getProjectDefaultPath()).map((projectId) => {
            const dockerInfo = isExists(this.getDockerPath(projectId, "dockerInfo.json")) ? this.getDockerInfo(projectId) : undefined;
            if (dockerInfo !== undefined) {
                const getRam = this.commandDockerAsync(
                    `docker stats --format "{{.MemPerc}}" ${dockerInfo.containerName}`,
                    (result: Buffer) => {
                        const ramUsage = result.toString("utf8").replace(/\n/gi, "").split(`\u001b[2J`).join("").replace(`\u001B[H`, "");
                        if (ramUsage.length > 0) {
                            this.setDockerInfo(projectId, {
                                ...dockerInfo,
                                ramUsage: ramUsage,
                            });
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
            this.commandDockerAsync(
                command,
                (result: Buffer) => {
                    const networkInfo = result.toString().replace(/\n/gi, "").split(" ");
                    networkInfo[0] === "[]"
                        ? this.setDockerNetWorkInfo({
                              networkName,
                              id: networkInfo[1],
                          })
                        : this.setDockerNetWorkInfo({
                              networkName,
                              subnet: networkInfo[1].split(":")[1].replace(/]/gi, ""),
                              gateway: networkInfo[0].split(":")[1],
                              id: networkInfo[2],
                          });
                },
                (error) => {
                    log.error(error);
                }
            );
        });
    }

    static updateStatus() {
        fs.readdirSync(DataProjectManager.getProjectDefaultPath()).map((projectId) => {
            const dockerInfo = isExists(this.getDockerPath(projectId, "dockerInfo.json")) ? this.getDockerInfo(projectId) : undefined;
            if (dockerInfo !== undefined) {
                this.commandDockerAsync(
                    `docker inspect --format="{{.State.Status}}" ${dockerInfo.containerName}`,
                    (state: Buffer) => {
                        this.setDockerInfo(projectId, {
                            ...dockerInfo,
                            status: state.toString().replace(/\n/gi, "") as "created" | "running" | "exited",
                        });
                    },
                    (error) => {
                        log.error(error);
                    }
                );
                this.commandDockerAsync(
                    `docker inspect --format="{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}" ${dockerInfo.containerName}`,
                    (ip: Buffer) => {
                        this.setDockerInfo(projectId, {
                            ...dockerInfo,
                            containerIP: ip.toString().replace(/\n/gi, ""),
                        });
                    },
                    (error) => {
                        log.error(error);
                    }
                );
            }
        });
    }

    static getNetwork(networkName?: string) {
        const dockerNetworkJsonData = this.getDockerNetworkInfo() ? (this.getDockerNetworkInfo() as TDockerNetworkJsonData) : ({} as TDockerNetworkJsonData);
        return Object.values(dockerNetworkJsonData).filter((networkInfo) => {
            return networkName === undefined || networkInfo.networkName === networkName;
        });
    }

    static createNetwork(dockerNetworkInfo: TDockerNetworkCreateData) {
        if (!isExists(this.getDockerNetworkPath())) {
            fs.mkdirSync(this.getDockerNetworkPath(), { recursive: true });
        }
        if (this.getNetwork(dockerNetworkInfo.networkName).length > 0) {
            log.error(`[DataDockerManager] createNetwork -> ${dockerNetworkInfo.networkName} is already exist`);
            return false;
        }

        let command = `docker network create --driver=bridge `;
        command += dockerNetworkInfo.subnet ? `--subnet=${dockerNetworkInfo.subnet} ` : ``;
        command += dockerNetworkInfo.ipRange ? `--ip-range=${dockerNetworkInfo.ipRange} ` : ``;
        command += dockerNetworkInfo.gateway ? `--gateway=${dockerNetworkInfo.gateway} ` : ``;
        command += `${dockerNetworkInfo.networkName}`;

        this.commandDockerAsync(
            command,
            (networkId: Buffer) => {
                const networkInfo = this.commandDockerSync(`docker network inspect --format="{{".IPAM.Config"}} {{".Containers"}}" ${dockerNetworkInfo.networkName}`).split(" ");
                log.debug(networkInfo);
                this.setDockerNetWorkInfo({
                    ...dockerNetworkInfo,
                    subnet: networkInfo[0].replace("[{", ""),
                    ipRange: networkInfo[1],
                    gateway: networkInfo[2],
                    id: networkId.toString().replace("\n", ""),
                });
            },
            (error) => {
                log.error(error);
            }
        );
        return true;
    }

    static async deleteNetwork(networkName: string) {
        this.commandDockerAsync(
            `docker network rm ${networkName}`,
            () => {
                const dockerNetworkJsonData = this.getDockerNetworkInfo() as TDockerNetworkJsonData;
                delete dockerNetworkJsonData[networkName];
                setJsonData(this.getDockerNetworkPath("dockerNetworkList.json"), dockerNetworkJsonData);
            },
            (error) => {
                log.error(error);
            }
        );
    }

    static getDockerPath(projectId: string, type: undefined | "dockerInfo.json" = undefined) {
        return type === undefined ? DataProjectManager.getProjectDataPath(projectId) : `${DataProjectManager.getProjectDataPath(projectId)}/${type}`;
    }
    static getDockerInfo(projectId: string) {
        return getJsonData(this.getDockerPath(projectId, "dockerInfo.json"));
    }

    static setDockerInfo(projectId: string, dockerInfo: TDockerData) {
        return setJsonData(this.getDockerPath(projectId, "dockerInfo.json"), dockerInfo);
    }

    static get(userId: string, projectName?: string) {
        return fs
            .readdirSync(DataProjectManager.getProjectDefaultPath())
            .filter((projectId) => {
                return projectName === undefined || DataProjectManager.getProjectId(userId, projectName) === projectId;
            })
            .reduce((dockerInfoList: TDockerData[], projectId: string) => {
                dockerInfoList.push(this.getDockerInfo(projectId));
                return dockerInfoList;
            }, []);
    }

    static createPkgProgram(
        userId: string,
        dockerInfo: TDockerCreateData,
        {
            projectId,
            projectName,
            projectParticipants,
        }: {
            projectId: string;
            projectName: string;
            projectParticipants: string[];
        }
    ) {
        if (!fs.existsSync(`${DataDirectoryPath}/docker`)) {
            fs.mkdirSync(`${DataDirectoryPath}/docker`, { recursive: true });
        }
        if (!isExists(`${DataDirectoryPath}/docker/server-linux`)) {
            this.commandDockerAsync(
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
                        this.createDockerFile(userId, dockerInfo, {
                            projectId,
                            projectName,
                            projectParticipants,
                        });
                    }
                }
            );
        } else {
            this.createDockerFile(userId, dockerInfo, {
                projectId,
                projectName,
                projectParticipants,
            });
        }
    }

    static createDockerFile(
        userId: string,
        dockerInfo: TDockerCreateData,
        {
            projectId,
            projectName,
            projectParticipants,
        }: {
            projectId: string;
            projectName: string;
            projectParticipants: string[];
        }
    ) {
        const socketPort = Math.floor(Math.random() * (49998 - 40000 + 1)) + 40000;
        let dockerFileContent = `FROM ${dockerInfo.image}:${dockerInfo.tag ?? "latest"}
        
COPY ./server-linux /server-linux
        
EXPOSE ${socketPort}

CMD ["./server-linux", "${socketPort}"]`;

        fs.writeFileSync(`${DataDirectoryPath}/docker/Dockerfile`, dockerFileContent);

        this.commandDockerAsync(
            `docker build -t ${projectName.toLowerCase()}:latest ${DataDirectoryPath}/docker`,
            () => {},
            (result) => {
                log.debug(`dockerfile create result -> ${result}`);
            },
            (code) => {
                code === 0
                    ? this.create(userId, dockerInfo, {
                          projectId,
                          projectName,
                          projectParticipants,
                      }) //, projectName.toLowerCase(), socketPort)
                    : DataAlarmManager.create(userId, {
                          type: "workspace",
                          location: "",
                          content: `${userId} could not create workspace : ${projectName}`,
                          checkAlarm: projectParticipants.reduce((list: { [ket in string]: boolean }, member) => {
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
            projectId,
            projectName,
            projectParticipants,
        }: {
            projectId: string;
            projectName: string;
            projectParticipants: string[];
        }
    ) {
        const tag = dockerInfo.tag ?? "latest";
        const projectPath = DataProjectManager.getProjectWorkPath(projectId);
        const containerName = dockerInfo.containerName ?? projectName;

        let command = `docker run -itd --volume="${path.resolve(path.normalize(projectPath))}:/home/${projectName}" -w /home/${projectName} `;
        if (dockerInfo.portInfo !== undefined) {
            Object.keys(dockerInfo.portInfo).map((hostPort: string) => {
                command += `-p ${hostPort}:${(dockerInfo.portInfo as TPortMappingData)[hostPort]} `;
            });
        }
        if (dockerInfo.linkContainer !== undefined) {
            const linkProjectId = fs
                .readdirSync(DataProjectManager.getProjectDefaultPath())
                .filter((Id) => {
                    return Id !== projectId;
                })
                .find((projectId) => {
                    return (this.getDockerInfo(projectId) as TDockerData).containerName === dockerInfo.linkContainer;
                });
            if (linkProjectId !== undefined) {
                const linkContainerInfo = this.getDockerInfo(linkProjectId) as TDockerData;
                linkContainerInfo.containers.push(containerName);
                this.setDockerInfo(linkProjectId, linkContainerInfo);
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

        this.commandDockerAsync(
            command,
            (containerId: Buffer) => {
                const bridgeInfo: TBridgeInfo = {};
                bridgeInfo[dockerInfo.bridgeName ?? "bridge"] = dockerInfo.bridgeAlias ? dockerInfo.bridgeAlias : "";
                this.setDockerInfo(projectId, {
                    containerName: containerName,
                    image: dockerInfo.image,
                    tag: tag,
                    containerId: containerId.toString().replace("\n", ""),
                    status: this.commandDockerSync(`docker inspect --format="{{.State.Status}}" ${containerName}`) as "created" | "running" | "exited",
                    bridgeInfo: bridgeInfo,
                    containers: dockerInfo.linkContainer ? [dockerInfo.linkContainer] : [],
                    portInfo: dockerInfo.portInfo,
                });

                DataAlarmManager.create(userId, {
                    type: "workspace",
                    location: `?workspace=${projectId}`,
                    content: `${userId} created workspace : ${projectName}`,
                    checkAlarm: projectParticipants.reduce((list: { [ket in string]: boolean }, member) => {
                        list[member] = true;
                        return list;
                    }, {}),
                });
                log.info(`Create docker container: ${containerId}`);
            },
            (error) => {
                log.error(`${error}`);
                if ((error.includes("Error") || error.includes("error")) && !error.includes("port")) {
                    removeData(DataProjectManager.getProjectWorkPath(projectId));
                    removeData(DataProjectManager.getProjectDataPath(projectId));
                    DataAlarmManager.create(userId, {
                        type: "workspace",
                        location: `/`,
                        content: `${userId} could not create workspace : ${projectName}, error is: ${error}`,
                        checkAlarm: projectParticipants.reduce((list: { [ket in string]: boolean }, member) => {
                            list[member] = true;
                            return list;
                        }, {}),
                    });
                }
            }
        );
    }

    static getProjectId(userId: string, containerId: string) {
        return fs.readdirSync(DataProjectManager.getProjectDefaultPath()).find((projectId) => {
            return this.getDockerInfo(projectId).containerId === containerId && (DataProjectManager.isProjectCreator(userId, projectId) || DataProjectManager.isProjectParticipants(userId, projectId));
        });
    }

    static manage(userId: string, containerId: string, dockerCommand: "start" | "stop" | "restart" | "rm") {
        const projectId = this.getProjectId(userId, containerId);
        const dockerInfo = projectId ? this.getDockerInfo(projectId) : undefined;

        if (dockerInfo === undefined || projectId === undefined) {
            log.error(`[DataDockerManager] manage -> fail to getDockerInfo`);
            return false;
        }

        this.commandDockerAsync(
            `docker ${dockerCommand} ${dockerInfo.containerName}`,
            () => {
                const state = this.commandDockerSync(`docker inspect --format="{{.State.Status}}" ${dockerInfo.containerName}`) as "created" | "running" | "exited";
                this.setDockerInfo(projectId, { ...dockerInfo, status: state })
                    ? log.info(`Docker ${dockerCommand} ${dockerInfo.containerName}`)
                    : log.error(`[DataDockerManager] manage -> fail to setDockerInfo`);
                DataAlarmManager.create(userId, {
                    type: "workspace",
                    location: "",
                    content: `${userId} commands ${dockerCommand} to ${dockerInfo.containerName}`,
                    checkAlarm: (DataProjectManager.getProjectInfo(projectId)?.projectParticipants as string[]).reduce((list: { [ket in string]: boolean }, member) => {
                        list[member] = true;
                        return list;
                    }, {}),
                });
            },
            (error) => {
                log.error(error);
            }
        );
        return true;
    }

    static updateFromDocker(userId: string, containerId: string, dockerInfo: TDockerUpdateData) {
        const projectName = DataProjectManager.getProjectInfo(this.getProjectId(userId, containerId) as string)?.projectName;
        if (projectName === undefined) {
            return false;
        }
        return this.update(userId, projectName, dockerInfo);
    }

    static update(userId: string, projectName: string, dockerInfo: TDockerUpdateData) {
        const projectId = DataProjectManager.getProjectId(userId, projectName);
        if (projectId === undefined) {
            log.error(`no project existed ${projectName}`);
            return false;
        }
        const newDockerInfo = this.getDockerInfo(projectId) as TDockerData;
        if (dockerInfo.bridgeName !== undefined && Object.keys(newDockerInfo.bridgeInfo).includes(dockerInfo.bridgeName) && dockerInfo.connect === false) {
            delete newDockerInfo.bridgeInfo[dockerInfo.bridgeName as string];
        }
        if (dockerInfo.linkContainer !== undefined && dockerInfo.bridgeName !== undefined && !newDockerInfo.containers.includes(dockerInfo.linkContainer) && dockerInfo.connect === true) {
            const linkProjectId = fs
                .readdirSync(DataProjectManager.getProjectDefaultPath())
                .filter((Id) => {
                    return Id !== projectId;
                })
                .find((projectId) => {
                    return (this.getDockerInfo(projectId) as TDockerData).containerName === dockerInfo.linkContainer;
                });
            if (linkProjectId !== undefined) {
                newDockerInfo.bridgeInfo[dockerInfo.bridgeName as string] = dockerInfo.bridgeAlias ?? "";
                newDockerInfo.containers.push(dockerInfo.linkContainer);
                const linkContainerInfo = this.getDockerInfo(linkProjectId) as TDockerData;
                linkContainerInfo.containers.push(newDockerInfo.containerName), this.setDockerInfo(linkProjectId, linkContainerInfo);
            }
        }
        if (dockerInfo.bridgeName !== undefined && dockerInfo.linkContainer === undefined && !Object.keys(newDockerInfo.bridgeInfo).includes(dockerInfo.bridgeName) && dockerInfo.connect === true) {
            log.debug(`docker Info : ${dockerInfo.bridgeName} : ${dockerInfo.bridgeAlias}`);
            newDockerInfo.bridgeInfo[dockerInfo.bridgeName as string] = dockerInfo.bridgeAlias ?? "";
            log.debug(`docker Info : ${newDockerInfo.bridgeInfo[dockerInfo.bridgeName as string]}}`);
        }

        if (dockerInfo.bridgeName !== undefined && Object.keys(newDockerInfo.bridgeInfo).includes(dockerInfo.bridgeName) && dockerInfo.connect === false) {
            this.commandDockerAsync(
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
            const linkProjectId = fs
                .readdirSync(DataProjectManager.getProjectDefaultPath())
                .filter((Id) => {
                    return Id !== projectId;
                })
                .find((projectId) => {
                    return (this.getDockerInfo(projectId) as TDockerData).containerName === dockerInfo.linkContainer;
                });
            if (linkProjectId !== undefined) {
                let command = `docker network connect --link ${dockerInfo.linkContainer} `;
                command += dockerInfo.bridgeAlias ? `--alias ${dockerInfo.bridgeAlias} ` : ``;
                command += `${dockerInfo.bridgeName} ${newDockerInfo.containerName}`;
                log.debug(`link container connect command : ${command}`);
                this.commandDockerAsync(
                    command,
                    () => {},
                    (error) => {
                        log.error(error);
                        return false;
                    },
                    (code: any) => {
                        if (code === 1) {
                        }
                    }
                );
            }
        }

        if (dockerInfo.bridgeName !== undefined && dockerInfo.linkContainer === undefined && !Object.keys(newDockerInfo.bridgeInfo).includes(dockerInfo.bridgeName) && dockerInfo.connect === true) {
            let command = `docker network connect `;
            command += dockerInfo.bridgeAlias ? `--alias ${dockerInfo.bridgeAlias} ` : ``;
            command += `${dockerInfo.bridgeName} ${newDockerInfo.containerName}`;

            this.commandDockerAsync(
                command,
                () => {},
                (error) => {
                    log.error(error);
                    return false;
                },
                (code) => {
                    if (code === 1) {
                    }
                }
            );
        }

        if (dockerInfo.containerName !== undefined && newDockerInfo.containerName !== dockerInfo.containerName) {
            this.commandDockerAsync(
                `docker rename ${newDockerInfo.containerName} ${dockerInfo.containerName}`,
                () => {},
                (error) => {
                    log.error(error);
                    return false;
                },
                (code) => {
                    if (code === 0) {
                        log.debug(`containerName changed ${dockerInfo.containerName}`);
                    }
                }
            );
        }

        newDockerInfo.containerName = dockerInfo.containerName ?? newDockerInfo.containerName;

        log.info(`docker update complete ${JSON.stringify({ newDockerInfo })}`);
        DataAlarmManager.create(userId, {
            type: "workspace",
            location: "",
            content: `${userId} update ${projectName} : ${dockerInfo.containerName} infomation`,
            checkAlarm: (DataProjectManager.getProjectInfo(projectId)?.projectParticipants as string[]).reduce((list: { [ket in string]: boolean }, member) => {
                list[member] = true;
                return list;
            }, {}),
        });
        return setJsonData(this.getDockerPath(projectId, "dockerInfo.json"), newDockerInfo) ? true : false;
    }

    static delete(userId: string, projectName: string) {
        const projectId = DataProjectManager.getProjectId(userId, projectName) as string;
        const dockerInfo = projectId ? this.getDockerInfo(projectId) : undefined;
        if (dockerInfo === undefined || projectId === undefined) {
            log.error(`[DataDockerManager] manage -> fail to getDockerInfo`);
            return false;
        }
        this.commandDockerAsync(
            `docker stop ${dockerInfo.containerName}`,
            () => {
                this.commandDockerAsync(
                    `docker rm ${dockerInfo.containerName}`,
                    () => {
                        DataAlarmManager.create(userId, {
                            type: "workspace",
                            location: "",
                            content: `${userId} remove ${projectName} : ${dockerInfo.containerName}`,
                            checkAlarm: (DataProjectManager.getProjectInfo(projectId)?.projectParticipants as string[]).reduce((list: { [ket in string]: boolean }, member) => {
                                list[member] = true;
                                return list;
                            }, {}),
                        });
                        removeData(DataProjectManager.getProjectDataPath(projectId));
                    },
                    (error) => log.error(error)
                );
            },
            (error) => log.error(error)
        );

        return true;
    }

    static getDockerVisualizationInfo() {
        const visualizationInfo = {
            container: [],
            port: [],
            network: [],
        } as TDockerVisualData;
        fs.readdirSync(DataProjectManager.getProjectDefaultPath()).map((projectId) => {
            const dockerInfo = this.getDockerInfo(projectId) as TDockerData;

            visualizationInfo.container.push({
                ...dockerInfo,
                parent: Object.keys(dockerInfo.bridgeInfo).reduce((networkIdList: string[], bridgeName: string) => {
                    networkIdList.push((this.getDockerNetworkInfo() as TDockerNetworkJsonData)[bridgeName].id);
                    return networkIdList;
                }, []),
            }); // parent 정해지면 {...dockerInfo, parent: []}
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
                name: networkInfo.networkName,
                networkId: networkInfo.id,
                ip: networkInfo.subnet,
                containers: fs.readdirSync(DataProjectManager.getProjectDefaultPath()).reduce((containerIdList: string[], projectId: string) => {
                    const dockerInfo = this.getDockerInfo(projectId) as TDockerData;
                    Object.keys(dockerInfo.bridgeInfo).includes(networkInfo.networkName) ? containerIdList.push(dockerInfo.containerId) : undefined;
                    return containerIdList;
                }, []),
            } as TDockerNetworkVisualData;
            visualizationInfo.network.push(newNetworkInfo);
        });

        return visualizationInfo;
    }

    static async run() {
        this.getDefaultNetwork();
        if (!fs.existsSync(DataProjectManager.getProjectDefaultPath())) {
            fs.mkdirSync(DataProjectManager.getProjectDefaultPath(), {
                recursive: true,
            });
        }
        setInterval(() => {
            this.updateStatus();
            this.updateRamUsage();
        }, 5000);
    }
}
