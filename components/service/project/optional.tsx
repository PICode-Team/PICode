import React, { useRef } from "react";
import { cloneDeep } from "lodash";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import InsertPhotoIcon from "@material-ui/icons/InsertPhoto";

export const OptionalInput = ({
  type,
  classes,
  setSource,
  source,
  step,
}: any) => {
  const [upload, setUpload] = React.useState<boolean>(false);
  const [fileeName, setFileName] = React.useState<string>("");

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

  if (step === 3) {
    if (type === "git") {
      return (
        <div className={classes.optionalContent}>
          <div className={classes.inputContent}>
            <div className={classes.input}>
              <span>Project ID</span>
              <input
                placeholder="Input Github Url"
                onChange={(e) => {
                  setSource({ ...source, gitUrl: e.target.value });
                }}
                value={source === undefined ? "" : source.gitUrl}
              />
            </div>
          </div>
        </div>
      );
    } else if (type === "upload") {
      return (
        <div className={classes.optionalContent}>
          <div className={classes.inputContent}>
            <div className={classes.textarea}>
              <span>Project Zip File</span>
              <div
                className={classes.imageUpload}
                onDragOver={dragOver}
                onDragEnter={dragEnter}
                onDragLeave={dragLeave}
                onDrop={fileDrop}
                onClick={() => fileButton.current.click()}
              >
                {upload ? (
                  <div style={{ textAlign: "center", pointerEvents: "none" }}>
                    <InsertPhotoIcon
                      style={{ width: "40px", height: "40px" }}
                    />
                    <br />
                    <span>{fileeName !== "" ? fileeName : "Drop File"}</span>
                  </div>
                ) : (
                  <>
                    <div style={{ textAlign: "center" }}>
                      <CloudUploadIcon
                        style={{ width: "40px", height: "40px" }}
                      />
                      <br />
                      <span>Drag and Drop File or Click to upload File</span>
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
              }}
            />
            <div style={{ display: "inline-block" }}>
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
          </div>
        </div>
      );
    } else return <></>;
  } else {
    return <></>;
  }
};
