/* eslint-disable react-hooks/exhaustive-deps */
import { Check } from "@material-ui/icons";
import { cloneDeep } from "lodash";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { createProjectStyle } from "../../../styles/service/project/create";
import { resultType } from "../../constant/fetch/result";
import { TSource } from "./create";
import { DefualtInput } from "./defualt";

interface IEditProject {
  projectName: string;
  projectDescription: string;
  projectThumbnail?: string;
  projectParticipants?: string[];
}

interface IDockerInfo {
  containerName?: string;
  image: string;
  tag?: string;
  bridgeName?: string;
  bridgeAlias?: string;
  hostPort?: number;
  containerPort?: number;
  linkContainer?: string;
}

export default function EditProject() {
  const classes = createProjectStyle();
  const route = useRouter();
  const [step, setStep] = useState<number>(2);
  const [dockerInfo, setDockerInfo] = useState<IDockerInfo>({
    containerName: "",
    image: "",
    tag: "",
    bridgeName: "",
    bridgeAlias: "",
  });
  const [projectData, setProjectData] = useState<IEditProject>({
    projectDescription: "",
    projectName: "",
    projectParticipants: undefined,
    projectThumbnail: undefined,
  });
  const [originData, setOriginData] = useState<IEditProject>({
    projectDescription: "",
    projectName: "",
    projectParticipants: undefined,
    projectThumbnail: undefined,
  });
  const [source, setSource] = React.useState<TSource>();

  let getProjectData = async () => {
    let data = await fetch(
      `/api/project?projectName=${route.query.projectName}`,
      {
        method: "GET",
      }
    ).then((res) => res.json());
    if (data.projectList.length !== 0) {
      if (data.projectList[0].projectParticipants.length !== 0) {
        data.projectList[0].projectParticipants =
          data.projectList[0].projectParticipants;
      } else {
        data.projectList[0].projectParticipants = [];
      }
      setOriginData({
        projectName: data.projectList[0].projectName,
        projectDescription: data.projectList[0].projectDescription,
        projectThumbnail: undefined,
        projectParticipants: data.projectList[0].projectParticipants,
      });
      setProjectData({
        projectName: data.projectList[0].projectName,
        projectDescription: data.projectList[0].projectDescription,
        projectThumbnail: undefined,
        projectParticipants: data.projectList[0].projectParticipants,
      });
      setDockerInfo({
        containerName: data.projectList[0].containerName ?? "",
        image: data.projectList[0].image ?? "",
        tag: data.projectList[0].tag ?? "",
        bridgeName: data.projectList[0].bridgeName ?? "",
        bridgeAlias: data.projectList[0].bridgeAlias ?? "",
        hostPort: data.projectList[0].hostPort ?? "",
        containerPort: data.projectList[0].containerPort ?? "",
        linkContainer: data.projectList[0].linkContainer ?? "",
      });
    }
  };

  useEffect(() => {
    if (route.query.projectName === undefined) {
      window.location.href = "/";
    } else {
      getProjectData();
    }
  }, []);

  let editData = async () => {
    let realData = cloneDeep(projectData);
    let realContainer = cloneDeep(dockerInfo);
    if (realData?.projectParticipants !== undefined) {
      realData.projectParticipants = realData.projectParticipants;
    }
    let payload = {
      projectName: route.query.projectName,
      projectInfo: realData,
      dockerInfo: realContainer,
    };

    let result = await fetch(`/api/project`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(payload),
    }).then((res) => res.json());
    if (result.code === 200) {
      Swal.fire({
        title: "SUCCESS",
        text: `Edit ${originData?.projectName}`,
        icon: "success",
        heightAuto: false,
      }).then(() => {
        window.location.href = "/";
      });
    } else {
      Swal.fire({
        title: "ERROR",
        html: `ERROR Edit ${originData?.projectName}
                    <br />
                    <span>${resultType[result.code]}</span>`,
        icon: "error",
        heightAuto: false,
      });
    }
  };

  return (
    <>
      {originData !== undefined && (
        <div className={classes.root}>
          <div className={classes.header}>
            {`Edit ${originData?.projectName}`}
          </div>
          <div className={classes.createWrapper}>
            <div>
              <div className={classes.stepper}>
                <div
                  className={`${classes.step} ${step >= 2 && classes.active}`}
                >
                  <div
                    className={classes.stepNumber}
                    style={{ paddingBottom: step < 3 ? "15.2px" : "10px" }}
                  >
                    {step >= 3 ? <Check /> : <span>1</span>}
                  </div>
                  <div className={classes.stepText}>Edit Code</div>
                </div>
                <div
                  className={`${classes.lail} ${step === 3 && classes.active}`}
                ></div>
                <div
                  className={`${classes.step} ${step === 3 && classes.active}`}
                >
                  <div
                    className={classes.stepNumber}
                    style={{ paddingBottom: "15.2px" }}
                  >
                    <span>2</span>
                  </div>
                  <div className={classes.stepText}>Edit Container</div>
                </div>
              </div>
            </div>

            <div className={classes.content}>
              <div className={classes.inputContent}>
                <DefualtInput
                  classes={classes}
                  setDefualtInput={setProjectData}
                  defaultInput={projectData}
                  step={step}
                  setSource={setSource}
                  source={source}
                  type={"defualt"}
                  dockerInfo={dockerInfo}
                  setDockerInfo={setDockerInfo}
                  edit={true}
                />
                <div className={classes.buttonBox}>
                  <div
                    className={classes.button}
                    onClick={() => {
                      if (step === 2) {
                        window.location.href = "/";
                      } else {
                        setStep(step - 1);
                      }
                    }}
                  >
                    {step === 3 ? "PREV" : "CANCEL"}
                  </div>
                  <div
                    className={classes.button}
                    onClick={() => {
                      if (step === 2) {
                        setStep(3);
                      } else {
                        editData();
                      }
                    }}
                  >
                    {step === 3 ? "EDIT" : "NEXT"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
