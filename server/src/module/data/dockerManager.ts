import { spawn, spawnSync } from "child_process";
import {
  TDockerData,
  TDockerCreateData,
  TDockerNetworkJsonData,
  TDockerNetworkData,
  TDockerNetworkCreateData,
  TBridgeInfo,
  TDockerUpdateData,
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
    return type
      ? `${DataDirectoryPath}/network/${type}`
      : `${DataDirectoryPath}/network`;
  }

  static getDockerNetworkInfo() {
    if (!isExists(this.getDockerNetworkPath("dockerNetworkList.json"))) {
      return undefined;
    }
    return getJsonData(
      this.getDockerNetworkPath("dockerNetworkList.json")
    ) as TDockerNetworkJsonData;
  }

  static setDockerNetWorkInfo(dockerNetworkInfo: TDockerNetworkData) {
    const dockerNetworkJsonData = this.getDockerNetworkInfo()
      ? (this.getDockerNetworkInfo() as TDockerNetworkJsonData)
      : ({} as TDockerNetworkJsonData);

    dockerNetworkJsonData[dockerNetworkInfo.networkName] = dockerNetworkInfo;
    return setJsonData(
      this.getDockerNetworkPath("dockerNetworkList.json"),
      dockerNetworkJsonData
    )
      ? true
      : false;
  }

  static commandDockerSync(command: string) {
    const shell = os.platform() === "win32" ? "powershell.exe" : "bash";
    const commandDocker = spawnSync(shell, [command]);
    return commandDocker.stdout.toString().replace("/n", "");
  }

  static commandDockerAsync(
    command: string,
    stdout: (result: Buffer) => void,
    stderr: (error: any) => void
  ) {
    const shell = os.platform() === "win32" ? "powershell.exe" : "bash";
    const commandDocker = spawn(shell, [command]);
    commandDocker.stdout.on("data", stdout);
    commandDocker.stderr.on("data", stderr);
    return true;
  }

  static getNetwork(networkName?: string) {
    const dockerNetworkJsonData = this.getDockerNetworkInfo()
      ? (this.getDockerNetworkInfo() as TDockerNetworkJsonData)
      : ({} as TDockerNetworkJsonData);
    return Object.values(dockerNetworkJsonData).filter((networkInfo) => {
      return (
        networkName === undefined || networkInfo.networkName === networkName
      );
    });
  }

  static createNetwork(dockerNetworkInfo: TDockerNetworkCreateData) {
    if (!isExists(this.getDockerNetworkPath())) {
      fs.mkdirSync(this.getDockerNetworkPath(), { recursive: true });
    }
    if (this.getNetwork(dockerNetworkInfo.networkName).length > 0) {
      log.error(
        `[DataDockerManager] createNetwork -> ${dockerNetworkInfo.networkName} is already exist`
      );
      return false;
    }

    let command = `docker network create --driver=bridge `;
    command += dockerNetworkInfo.subnet
      ? `--subnet=${dockerNetworkInfo.subnet} `
      : ``;
    command += dockerNetworkInfo.ipRange
      ? `--ip-range=${dockerNetworkInfo.ipRange} `
      : ``;
    command += dockerNetworkInfo.gateway
      ? `--gateway=${dockerNetworkInfo.gateway} `
      : ``;
    command += `${dockerNetworkInfo.networkName}`;

    this.commandDockerAsync(
      command,
      (networkId: Buffer) => {
        const networkInfo = this.commandDockerSync(
          `docker network inspect --format="{{".IPAM.Config"}}" ${dockerNetworkInfo.networkName}`
        ).split(" ");
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
        const dockerNetworkJsonData =
          this.getDockerNetworkInfo() as TDockerNetworkJsonData;
        delete dockerNetworkJsonData[networkName];
        setJsonData(
          this.getDockerNetworkPath("dockerNetworkList.json"),
          dockerNetworkJsonData
        );
      },
      (error) => {
        log.error(error);
      }
    );
  }

  static getDockerPath(
    projectId: string,
    type: undefined | "dockerInfo.json" = undefined
  ) {
    return type === undefined
      ? DataProjectManager.getProjectDataPath(projectId)
      : `${DataProjectManager.getProjectDataPath(projectId)}/${type}`;
  }
  static getDockerInfo(projectId: string) {
    return getJsonData(
      this.getDockerPath(projectId, "dockerInfo.json")
    ) as TDockerData;
  }

  static setDockerInfo(projectId: string, dockerInfo: TDockerData) {
    return setJsonData(
      this.getDockerPath(projectId, "dockerInfo.json"),
      dockerInfo
    );
  }

  static get(userId: string, projectName?: string) {
    return fs
      .readdirSync(DataProjectManager.getProjectDefaultPath())
      .filter((projectId) => {
        return (
          projectName === undefined ||
          DataProjectManager.getProjectId(userId, projectName) === projectId
        );
      })
      .reduce((dockerInfoList: TDockerData[], projectId: string) => {
        dockerInfoList.push(this.getDockerInfo(projectId));
        return dockerInfoList;
      }, []);
  }

  static create(
    userId: string,
    dockerInfo: TDockerCreateData,
    {
      projectId,
      projectName,
      projectParticipants,
    }: { projectId: string; projectName: string; projectParticipants: string[] }
  ) {
    const tag = dockerInfo.tag ?? "latest";
    const projectPath = DataProjectManager.getProjectWorkPath(projectId);
    const containerName = dockerInfo.containerName ?? projectName;

    let command = `docker run -itd --volume="${path.resolve(
      path.normalize(projectPath)
    )}:/home/${projectName}" -w /home/${projectName} `;
    command += dockerInfo.bridgeName ? `--net ${dockerInfo.bridgeName} ` : ``;
    command += dockerInfo.bridgeAlias
      ? `--net-alias ${dockerInfo.bridgeAlias} `
      : ``;
    command +=
      dockerInfo.hostPort !== undefined &&
      dockerInfo.containerPort !== undefined
        ? `-p ${dockerInfo.hostPort}:${dockerInfo.containerPort} `
        : ``;
    command += dockerInfo.linkContainer
      ? `--link ${dockerInfo.linkContainer}:${dockerInfo.linkContainer} `
      : ``;
    command += `--name ${containerName} ${dockerInfo.image}:${tag}`;

    this.commandDockerAsync(
      command,
      (containerId: Buffer) => {
        const bridgeInfo: TBridgeInfo = {};
        if (
          dockerInfo.bridgeName !== undefined ||
          dockerInfo.bridgeAlias !== undefined
        ) {
          bridgeInfo[dockerInfo.bridgeName ?? "bridge"] = dockerInfo.bridgeAlias
            ? dockerInfo.bridgeAlias
            : undefined;
        }
        this.setDockerInfo(projectId, {
          containerName: containerName,
          image: dockerInfo.image,
          tag: tag,
          containerId: containerId.toString().replace("\n", ""),
          status: this.commandDockerSync(
            `docker inspect --format="{{.State.Status}}" ${containerName}`
          ).replace("/n", "") as "created" | "running" | "exited",
          bridgeInfo: bridgeInfo,
        });

        DataAlarmManager.create(userId, {
          type: "code & container",
          location: "",
          content: `${userId} created code & continer : ${projectName}`,
          checkAlarm: projectParticipants.reduce(
            (list: { [ket in string]: boolean }, member) => {
              list[member] = true;
              return list;
            },
            {}
          ),
        });
        log.info(`Create docker container: ${containerId}`);
      },
      (error) => {
        log.error(`${error}`);
      }
    );
  }

  static manage(
    userId: string,
    projectName: string,
    dockerCommand: "start" | "stop" | "restart" | "rm"
  ) {
    const projectId = DataProjectManager.getProjectId(userId, projectName);
    const dockerInfo = projectId ? this.getDockerInfo(projectId) : undefined;

    if (dockerInfo === undefined || projectId === undefined) {
      log.error(`[DataDockerManager] manage -> fail to getDockerInfo`);
      return false;
    }

    this.commandDockerAsync(
      `docker ${dockerCommand} ${dockerInfo.containerName}`,
      () => {
        const state = this.commandDockerSync(
          `docker inspect --format="{{.State.Status}}" ${dockerInfo.containerName}`
        ) as "created" | "running" | "exited";
        this.setDockerInfo(projectId, { ...dockerInfo, status: state })
          ? log.info(`Docker ${dockerCommand} ${dockerInfo.containerName}`)
          : log.error(`[DataDockerManager] manage -> fail to setDockerInfo`);
        DataAlarmManager.create(userId, {
          type: "code & container",
          location: "",
          content: `${userId} commands ${dockerCommand} to ${projectName} : ${dockerInfo.containerName}`,
          checkAlarm: (
            DataProjectManager.getProjectInfo(projectId)
              ?.projectParticipants as string[]
          ).reduce((list: { [ket in string]: boolean }, member) => {
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

  static update(
    userId: string,
    projectName: string,
    dockerInfo: TDockerUpdateData
  ) {
    const projectId = DataProjectManager.getProjectId(userId, projectName);
    if (projectId === undefined) {
      return false;
    }
    const newDockerInfo = this.getDockerInfo(projectId);
    if (
      dockerInfo.bridgeName !== undefined &&
      Object.keys(newDockerInfo.bridgeInfo).includes(dockerInfo.bridgeName) &&
      dockerInfo.connect === false
    ) {
      delete newDockerInfo.bridgeInfo[dockerInfo.bridgeName as string];
      this.commandDockerAsync(
        `docker network disconnect ${dockerInfo.bridgeName} ${newDockerInfo.containerName}`,
        () => {
          log.debug(`Bridge disconnect ${dockerInfo.bridgeName}`);
        },
        (error) => {
          log.error(error);
        }
      );
    }
    if (
      dockerInfo.bridgeName !== undefined &&
      !Object.keys(newDockerInfo.bridgeInfo).includes(dockerInfo.bridgeName) &&
      dockerInfo.connect === true
    ) {
      newDockerInfo.bridgeInfo[dockerInfo.bridgeName as string] =
        dockerInfo.bridgeAlias;
      let command = `docker network connect `;
      command += dockerInfo.bridgeAlias
        ? `--alias ${dockerInfo.bridgeAlias} `
        : ``;
      command += `${dockerInfo.bridgeName} ${newDockerInfo.containerName}`;

      this.commandDockerAsync(
        command,
        () => {
          log.debug(`Bridge connect ${dockerInfo.bridgeName}`);
        },
        (error) => {
          log.error(error);
          return false;
        }
      );
    }
    if (
      dockerInfo.containerName !== undefined &&
      newDockerInfo.containerName !== dockerInfo.containerName
    ) {
      this.commandDockerAsync(
        `docker rename ${newDockerInfo.containerName} ${dockerInfo.containerName}`,
        () => {
          log.debug(`containerName changed ${dockerInfo.containerName}`);
        },
        (error) => {
          log.error(error);
          return false;
        }
      );
      newDockerInfo.containerName = dockerInfo.containerName as string;
    }
    DataAlarmManager.create(userId, {
      type: "code & container",
      location: "",
      content: `${userId} update ${projectName} : ${dockerInfo.containerName} infomation`,
      checkAlarm: (
        DataProjectManager.getProjectInfo(projectId)
          ?.projectParticipants as string[]
      ).reduce((list: { [ket in string]: boolean }, member) => {
        list[member] = true;
        return list;
      }, {}),
    });
    return setJsonData(
      this.getDockerPath(projectId, "dockerInfo.json"),
      newDockerInfo
    )
      ? true
      : false;
  }

  static delete(userId: string, projectName: string) {
    const projectId = DataProjectManager.getProjectId(
      userId,
      projectName
    ) as string;
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
            removeData(DataProjectManager.getProjectDataPath(projectId));
            DataAlarmManager.create(userId, {
              type: "code & container",
              location: "",
              content: `${userId} remove ${projectName} : ${dockerInfo.containerName}`,
              checkAlarm: (
                DataProjectManager.getProjectInfo(projectId)
                  ?.projectParticipants as string[]
              ).reduce((list: { [ket in string]: boolean }, member) => {
                list[member] = true;
                return list;
              }, {}),
            });
          },
          (error) => log.error(error)
        );
      },
      (error) => log.error(error)
    );

    return true;
  }
}
