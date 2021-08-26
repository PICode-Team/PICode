import React, { useEffect, useRef, useState } from "react";
import { createProjectStyle } from "../../../styles/service/project/create";
import CreateNewFolderIcon from "@material-ui/icons/CreateNewFolder";
import PublishIcon from "@material-ui/icons/Publish";
import GitHubIcon from "@material-ui/icons/GitHub";
import { DefualtInput } from "./defualt";
import { OptionalInput } from "./optional";
import { Step, StepLabel, Stepper } from "@material-ui/core";
import { Check } from "@material-ui/icons";

interface TSource {
  type: string;
  gitUrl?: string;
  upload?: {
    uploadFileId?: string;
    isExtract?: boolean;
  };
}

interface TProjectInfo {
  projectName: string;
  projectDescription: string;
  projectThumbnail?: string;
  projectParticipants?: any;
}

interface TCreate {
  projectInfo: TProjectInfo;
  source?: TSource;
}

export default function Create() {
  const classes = createProjectStyle();
  const [type, setType] = React.useState<string>("");
  const [defaultInput, setDefualtInput] = React.useState<TProjectInfo>({
    projectDescription: "",
    projectName: "",
    projectParticipants: undefined,
    projectThumbnail: undefined,
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
      projectParticipants?: string[] | string;
    } = defaultInput;
    if (defaultInput.projectParticipants !== undefined) {
      resultInputData.projectParticipants =
        defaultInput.projectParticipants.split(",");
    }

    let payload: TCreate = {
      projectInfo: resultInputData,
      source: source,
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
      <div className={classes.header}>Create Project</div>
      <div className={classes.createWrapper}>
        <div>
          <div className={classes.stepper}>
            <div className={`${classes.step} ${classes.active}`}>
              <div className={classes.stepNumber}>
                {type !== "" ? <Check /> : 1}
              </div>
              <div className={classes.stepText}>
                Select master blaster campaign settings
              </div>
            </div>
            <div
              className={`${classes.lail} ${type !== "" && classes.active}`}
            ></div>
            <div className={`${classes.step} ${type !== "" && classes.active}`}>
              <div className={classes.stepNumber}>2</div>
              <div className={classes.stepText}>Create an ad group</div>
            </div>
            <div className={classes.lail}></div>
            <div className={classes.step}>
              <div className={classes.stepNumber}>3</div>
              <div className={classes.stepText}>Create an ad</div>
            </div>
          </div>
        </div>
        <div>
          {type === "" && (
            <div className={classes.content}>
              <div className={classes.typeContent}>
                <div
                  className={classes.selectContent}
                  onClick={() => {
                    setStep(2);
                    setType("defualt");
                  }}
                >
                  <div className={classes.typeNode}>
                    <CreateNewFolderIcon />
                    <span>Create a Project</span>
                  </div>
                </div>
                <div
                  className={classes.selectContent}
                  onClick={() => {
                    setStep(2);
                    setType("git");
                  }}
                >
                  <div className={classes.typeNode}>
                    <GitHubIcon />
                    <span>Clone project in Git</span>
                  </div>
                </div>
                <div
                  className={classes.selectContent}
                  onClick={() => {
                    setStep(2);
                    setType("upload");
                  }}
                >
                  <div className={classes.typeNode}>
                    <PublishIcon />
                    <span>Upload your own Project</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          {type !== "" && (
            <DefualtInput
              classes={classes}
              setDefualtInput={setDefualtInput}
              defaultInput={defaultInput}
              step={step}
            />
          )}
          {type !== "" && (
            <OptionalInput
              type={type}
              classes={classes}
              setSource={setSource}
              source={source}
              step={step}
            />
          )}
          {type !== "" && (
            <div className={classes.buttonBox}>
              <div
                className={classes.button}
                onClick={() => {
                  setStep(step - 1);
                  setType("");
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
          )}
        </div>
      </div>
    </div>
  );
}
