import React, { useEffect, useRef, useState } from "react";
import { createProjectStyle } from "../../../styles/service/project/create";
import CreateNewFolderIcon from "@material-ui/icons/CreateNewFolder";
import PublishIcon from "@material-ui/icons/Publish";
import GitHubIcon from "@material-ui/icons/GitHub";
import { DefualtInput } from "./defualt";
import { Check } from "@material-ui/icons";

export interface TSource {
  type: string;
  gitUrl?: string;
  upload?: {
    uploadFileId?: string;
    isExtract?: boolean;
  };
}

export interface IProjectInfo {
  projectName: string;
  projectDescription: string;
  projectThumbnail?: string;
  projectParticipants?: string[];
}

export interface IDockerInfo {
  containerName?: string;
  image: string;
  tag?: string;
  bridgeName?: string;
  bridgeAlias?: string;
  portInfo: IPortInfo;
  linkContainer?: string;
}

type IPortInfo = {
  [key in string]: number;
};

interface TCreate {
  projectInfo: IProjectInfo;
  dockerInfo: IDockerInfo;
  source?: TSource;
}

export default function Create() {
  const classes = createProjectStyle();
  const [type, setType] = React.useState<string>("");
  const [defaultInput, setDefualtInput] = React.useState<IProjectInfo>({
    projectDescription: "",
    projectName: "",
    projectParticipants: undefined,
    projectThumbnail: undefined,
  });
  const [dockerInfo, setDockerInfo] = useState<IDockerInfo>({
    containerName: "",
    image: "",
    tag: "",
    bridgeName: "",
    bridgeAlias: "",
    portInfo: {},
  });
  const [source, setSource] = React.useState<TSource>();
  const [step, setStep] = useState<number>(1);

  useEffect(() => {
    if (type === "git") {
      setSource({
        type: "gitUrl",
        gitUrl: undefined,
      });
    } else if (type === "upload") {
      setSource({
        type: "upload",
        upload: {
          uploadFileId: undefined,
          isExtract: true,
        },
      });
    } else {
      setSource({
        type: "nothing",
      });
    }
  }, [type]);

  let submitData = async () => {
    let resultInputData: {
      projectName: string;
      projectDescription: string;
      projectThumbnail?: string;
      projectParticipants?: string[];
    } = defaultInput;
    if (defaultInput.projectParticipants !== undefined) {
      resultInputData.projectParticipants = defaultInput.projectParticipants;
    }

    let payload: TCreate = {
      projectInfo: resultInputData,
      dockerInfo: {
        containerName:
          dockerInfo.containerName !== ""
            ? dockerInfo.containerName
            : undefined,
        image: dockerInfo.image,
        tag: dockerInfo.tag !== "" ? dockerInfo.tag : undefined,
        bridgeName:
          dockerInfo.bridgeName !== "" ? dockerInfo.bridgeName : undefined,
        bridgeAlias:
          dockerInfo.bridgeAlias !== "" ? dockerInfo.bridgeAlias : undefined,
        portInfo: dockerInfo.portInfo,
        linkContainer:
          dockerInfo.linkContainer !== ""
            ? dockerInfo.linkContainer
            : undefined,
      },
      source,
    };

    let data = await fetch(`http://localhost:8000/api/project`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).then((res) => res.json());

    if (data.code === 200) {
      window.location.href = "/";
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.header}>{`Create Code & Container`}</div>
      <div className={classes.createWrapper}>
        <div>
          <div className={classes.stepper}>
            <div className={`${classes.step} ${classes.active}`}>
              <div
                className={classes.stepNumber}
                style={{ paddingBottom: step === 1 ? "15.2px" : "10px" }}
              >
                {step >= 2 ? <Check /> : <span>1</span>}
              </div>
              <div className={classes.stepText}>Select Type</div>
            </div>
            <div
              className={`${classes.lail} ${step >= 2 && classes.active}`}
            ></div>
            <div className={`${classes.step} ${step >= 2 && classes.active}`}>
              <div
                className={classes.stepNumber}
                style={{ paddingBottom: step < 3 ? "15.2px" : "10px" }}
              >
                {step >= 3 ? <Check /> : <span>2</span>}
              </div>
              <div className={classes.stepText}>Create Code</div>
            </div>
            <div
              className={`${classes.lail} ${step === 3 && classes.active}`}
            ></div>
            <div className={`${classes.step} ${step === 3 && classes.active}`}>
              <div
                className={classes.stepNumber}
                style={{ paddingBottom: "15.2px" }}
              >
                <span>3</span>
              </div>
              <div className={classes.stepText}>Create Container</div>
            </div>
          </div>
        </div>

        <div style={{ overflow: "auto" }}>
          {type === "" && (
            <div className={classes.content}>
              <div className={classes.typeContent}>
                <div
                  className={classes.typeNode}
                  onClick={() => {
                    setStep(2);
                    setType("defualt");
                  }}
                >
                  <CreateNewFolderIcon />
                  <div>Create Project</div>
                </div>
                <div
                  className={classes.typeNode}
                  onClick={() => {
                    setStep(2);
                    setType("git");
                  }}
                >
                  <GitHubIcon />
                  <div>Clone Project</div>
                </div>
                <div
                  className={classes.typeNode}
                  onClick={() => {
                    setStep(2);
                    setType("upload");
                  }}
                >
                  <PublishIcon />
                  <div>Upload Project</div>
                </div>
              </div>
            </div>
          )}

          {type !== "" && (
            <div className={classes.content}>
              <div className={classes.inputContent}>
                <DefualtInput
                  classes={classes}
                  setDefualtInput={setDefualtInput}
                  defaultInput={defaultInput}
                  step={step}
                  setSource={setSource}
                  source={source}
                  type={type}
                  dockerInfo={dockerInfo}
                  setDockerInfo={setDockerInfo}
                  edit={false}
                />
                <div className={classes.buttonBox}>
                  <div
                    className={classes.button}
                    onClick={() => {
                      if (step === 2) {
                        setType("");
                        setDefualtInput({
                          projectDescription: "",
                          projectName: "",
                          projectParticipants: undefined,
                          projectThumbnail: undefined,
                        });
                        setDockerInfo({
                          containerName: "",
                          image: "",
                          tag: "",
                          bridgeName: "",
                          bridgeAlias: "",
                          portInfo: {},
                        });
                      }
                      setStep(step - 1);
                    }}
                  >
                    PREV
                  </div>
                  <div
                    className={classes.button}
                    onClick={() => {
                      if (step === 2) {
                        setStep(3);
                      } else {
                        submitData();
                      }
                    }}
                  >
                    {step === 3 ? "SUBMIT" : "NEXT"}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
