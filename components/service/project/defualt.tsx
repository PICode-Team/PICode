import React, { useEffect, useRef } from "react";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import InsertPhotoIcon from "@material-ui/icons/InsertPhoto";

export const DefualtInput = ({
  classes,
  setDefualtInput,
  defaultInput,
  type,
  step,
}: any) => {
  const [upload, setUpload] = React.useState<boolean>(false);
  const [imageName, setImageName] = React.useState<string>("");

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

  return (
    <div className={classes.content}>
      <div className={classes.inputContent}>
        {step === 2 && (
          <React.Fragment>
            <div className={classes.subTitle}>Sub Title1</div>
            <div className={classes.input}>
              <span>Project ID</span>
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
            <div className={classes.input}>
              <span>Project ID</span>
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
            <div className={classes.subTitle}>Sub Title2</div>
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
          </React.Fragment>
        )}
        {step === 3 && (
          <React.Fragment>
            <div className={classes.textarea}>
              <span>Project Thumbnail</span>
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
                        {type === "edit"
                          ? "If you want change image, upload image"
                          : "Drag and Drop Image or Click to upload Image"}
                      </span>
                    </div>
                  </>
                )}
              </div>
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
            <div className={classes.input}>
              <span>Project Participant</span>
              <input
                placeholder="Input project Participane ex)test1,test2,test3... "
                value={defaultInput.projectParticipants}
                onChange={(e) => {
                  setDefualtInput({
                    ...defaultInput,
                    projectParticipants: e.target.value,
                  });
                }}
              />
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};
