import React, { useEffect, useRef, useState } from "react";
import { cloneDeep } from "lodash";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import InsertPhotoIcon from "@material-ui/icons/InsertPhoto";
import Modal, { IUser } from "./modal";

export const DefualtInput = ({
  classes,
  setDefualtInput,
  defaultInput,
  type,
  step,
  setSource,
  source,
  dockerInfo,
  setDockerInfo,
}: any) => {
  const [upload, setUpload] = React.useState<boolean>(false);
  const [imageName, setImageName] = React.useState<string>("");
  const [fileeName, setFileName] = React.useState<string>("");
  const [participantList, setParticipantList] = useState<IUser[]>([]);
  const [imageCheck, setImageCheck] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);

  const fileButton = useRef<any>(null);

  const dragOver = (e: any) => {
    e.preventDefault();
  };

  const dragEnter = (e: any) => {
    e.preventDefault();
    setUpload(true);
  };

  const dragLeave = (e: any) => {
    e.preventDefault();
    setUpload(false);
  };

  const ThumbnailDrop = async (e: any) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files !== undefined) {
      setImageName(files[0].name);
      let formData = new FormData();
      formData.append("uploadFile", files[0]);
      let result = await fetch(`http://localhost:8000/api/data`, {
        method: "POST",
        body: formData,
      }).then((res) => res.json());
      if (result.code === 200) {
        setDefualtInput({
          ...defaultInput,
          projectThumbnail: result.uploadFileId,
        });
      }
    }
  };

  const fileDrop = async (e: any) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files !== undefined) {
      setFileName(files[0].name);
      let formData = new FormData();
      formData.append("uploadFile", files[0]);
      let result = await fetch(`http://localhost:8000/api/data`, {
        method: "POST",
        body: formData,
      }).then((res) => res.json());
      if (result.code === 200) {
        let tmpSource = source;
        tmpSource.upload.uploadFileId = result.uploadFileId;
        setSource(tmpSource);
      }
    }
  };

  const checkDockerImageValidity = async () => {
    const response = await fetch(`https://hub.docker.com/_/ubuntu`, {
      method: "GET",
      mode: "cors",
    }).then((res) => res.json());
    console.log(response);
  };

  useEffect(() => {
    // fetch
  }, []);

  return (
    <div className={classes.content}>
      <div className={classes.inputContent}>
        {step === 2 && (
          <React.Fragment>
            <div className={classes.subTitle}>Create Code</div>
            <div className={classes.input}>
              <span>
                Workspace Name <span className={classes.required}>*</span>
              </span>
              <input
                placeholder="Input Project Name"
                onChange={(e) => {
                  setDefualtInput({
                    ...defaultInput,
                    projectName: e.target.value,
                  });
                }}
                value={defaultInput.projectName}
              />
            </div>

            <div className={classes.divider}>
              <div />
            </div>
            <div className={classes.textarea}>
              <span>Project Description</span>
              <textarea
                rows={10}
                placeholder="Input Project Description"
                onChange={(e) => {
                  setDefualtInput({
                    ...defaultInput,
                    projectDescription: e.target.value,
                  });
                }}
                value={defaultInput.projectDescription}
              />
            </div>
            <div className={classes.divider}>
              <div />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                gap: "25px",
              }}
            >
              <div className={classes.textarea}>
                <span>Project Thumbnail</span>
                <div
                  className={classes.imageUpload}
                  onDragOver={dragOver}
                  onDragEnter={dragEnter}
                  onDragLeave={dragLeave}
                  onDrop={ThumbnailDrop}
                  onClick={() => fileButton.current.click()}
                >
                  {upload ? (
                    <div style={{ textAlign: "center", pointerEvents: "none" }}>
                      <InsertPhotoIcon
                        style={{ width: "40px", height: "40px" }}
                      />
                      <br />
                      <span>{imageName !== "" ? imageName : "Drop Image"}</span>
                    </div>
                  ) : (
                    <>
                      <div style={{ textAlign: "center" }}>
                        <CloudUploadIcon
                          style={{ width: "40px", height: "40px" }}
                        />
                        <br />
                        <span>
                          {type === "edit" ? (
                            "If you want change image, upload image"
                          ) : (
                            <React.Fragment>
                              <div>Drag and Drop Image or</div>
                              <div>Click to upload Image</div>
                            </React.Fragment>
                          )}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              {type === "upload" && (
                <React.Fragment>
                  <div className={classes.textarea}>
                    <span>
                      Project Zip File
                      <span className={classes.required}>*</span>
                    </span>
                    <div
                      style={{
                        display: "inline-block",
                        color: "#ffffff",
                        fontSize: "12px",
                        float: "right",
                      }}
                    >
                      is Extract?
                      <input
                        type="checkbox"
                        checked={source.upload ? source.upload.isExtract : true}
                        onClick={(e) => {
                          let tmpSource = cloneDeep(source);
                          tmpSource.upload.isExtract = e.currentTarget.checked;
                          setSource(tmpSource);
                        }}
                        style={{ verticalAlign: "middle" }}
                      />
                    </div>
                    <div
                      className={classes.imageUpload}
                      onDragOver={dragOver}
                      onDragEnter={dragEnter}
                      onDragLeave={dragLeave}
                      onDrop={fileDrop}
                      onClick={() => fileButton.current.click()}
                    >
                      {upload ? (
                        <div
                          style={{ textAlign: "center", pointerEvents: "none" }}
                        >
                          <InsertPhotoIcon
                            style={{ width: "40px", height: "40px" }}
                          />
                          <br />
                          <span>
                            {fileeName !== "" ? fileeName : "Drop File"}
                          </span>
                        </div>
                      ) : (
                        <>
                          <div style={{ textAlign: "center" }}>
                            <CloudUploadIcon
                              style={{ width: "40px", height: "40px" }}
                            />
                            <br />
                            <span>
                              <div>Drag and Drop File or</div>
                              <div>Click to upload File</div>
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <input
                    ref={fileButton}
                    style={{ display: "none" }}
                    type="file"
                    id="getFile"
                    onChange={async (e) => {
                      let tmpImage = e.target.files;
                      if (tmpImage !== null) {
                        let formData = new FormData();
                        formData.append("uploadFile", tmpImage[0]);
                        let result = await fetch(
                          `http://localhost:8000/api/data`,
                          {
                            method: "POST",
                            body: formData,
                          }
                        ).then((res) => res.json());
                        if (result.code === 200) {
                          let tmpSource = source;
                          tmpSource.upload.uploadFileId = result.uploadFileId;
                          setSource(tmpSource);
                        }
                      }
                    }}
                  />
                </React.Fragment>
              )}
            </div>

            <div className={classes.participant}>
              <span>Project Participant</span>
              <div
                onClick={() => {
                  setModal(true);
                }}
              >
                Input project Participant
              </div>
            </div>
            {type === "git" && (
              <React.Fragment>
                <div className={classes.divider}>
                  <div />
                </div>
                <div className={classes.subTitle}>Clone From Repository</div>
                <div className={classes.input}>
                  <span>
                    Repository URL<span className={classes.required}>*</span>
                  </span>
                  <input
                    placeholder="Input Repository URL"
                    onChange={(e) => {
                      setSource({ ...source, gitUrl: e.target.value });
                    }}
                    value={source === undefined ? "" : source.gitUrl}
                  />
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        )}
        {step === 3 && (
          <React.Fragment>
            <div className={classes.subTitle}>Create Container</div>
            <div className={classes.input}>
              <span>Container Name</span>
              <input
                placeholder="Input Container Name"
                onChange={(e) => {
                  setDockerInfo({
                    ...dockerInfo,
                    containerName: e.target.value,
                  });
                }}
                value={dockerInfo.containerName}
              />
            </div>
            <div className={classes.input}>
              <span>
                Image<span className={classes.required}>*</span>
              </span>
              <input
                placeholder="Input Image"
                onChange={(e) => {
                  setDockerInfo({
                    ...dockerInfo,
                    image: e.target.value,
                  });
                }}
                value={dockerInfo.image}
              />
            </div>
            {/* 드롭박스 메일주소 직접 입력 */}
            {/* 이미지 검증 필요 */}
            <div className={classes.input}>
              <span>Tag</span>
              <input
                placeholder="Input Tag"
                onChange={(e) => {
                  setDockerInfo({
                    ...dockerInfo,
                    tag: e.target.value,
                  });
                }}
                value={dockerInfo.tag}
              />
            </div>
            <div className={classes.input}>
              <span>Network Name</span>
              <input
                placeholder="Input Bridge Name"
                onChange={(e) => {
                  setDockerInfo({
                    ...dockerInfo,
                    bridgeName: e.target.value,
                  });
                }}
                value={dockerInfo.bridgeName}
              />
            </div>
            <div className={classes.input}>
              <span>Network Alias</span>
              <input
                placeholder="Input Bridge Alias"
                onChange={(e) => {
                  setDockerInfo({
                    ...dockerInfo,
                    bridgeAlias: e.target.value,
                  });
                }}
                value={dockerInfo.bridgeAlias}
              />
            </div>
            <input
              type="file"
              id="getFile"
              style={{ display: "none" }}
              ref={fileButton}
              onChange={async (e) => {
                let tmpImage = e.target.files;
                if (tmpImage !== null) {
                  let formData = new FormData();
                  formData.append("uploadFile", tmpImage[0]);
                  let result = await fetch(`http://localhost:8000/api/data`, {
                    method: "POST",
                    body: formData,
                  }).then((res) => res.json());
                  if (result.code === 200) {
                    setUpload(true);
                    setImageName(tmpImage[0].name);
                    setDefualtInput({
                      ...defaultInput,
                      projectThumbnail: result.uploadFileId,
                    });
                  }
                }
              }}
            />
          </React.Fragment>
        )}
      </div>
      <Modal
        modal={modal}
        setModal={setModal}
        participantList={participantList}
        defaultInput={defaultInput}
        setDefualtInput={setDefualtInput}
        setParticipantList={setParticipantList}
      />
    </div>
  );
};
