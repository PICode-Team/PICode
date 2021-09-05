import { DeleteForever, Edit, Settings } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { recentWorkStyle } from "../../../styles/service/dashboard/recentwork";
import { resultType } from "../../constant/fetch/result";
import Swal from "sweetalert2";

interface IProjectData {
  projectName: string;
  projectDescription: string;
  language: string;
  projectCreator: string;
  projectParticipants: string[];
  projectThumbnail?: string;
}

export default function CodeView() {
  const classes = recentWorkStyle();
  const [projectData, setProjectData] = useState<IProjectData[]>([]);

  let getData = async () => {
    let data = await fetch(`http://localhost:8000/api/project`, {
      method: "GET",
      mode: "cors",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());

    setProjectData(data.projectList ?? []);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div style={{ width: "100%", height: "100%", padding: "32px" }}>
      <div className={classes.title}>Project List</div>
      <div
        className={classes.workspaceContent}
        style={{
          gridTemplateRows: "repeat(4, 195px)",
        }}
      >
        {projectData.map((v, i) => (
          <div
            key={`project-card-${i}`}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            className={classes.item}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <div style={{ fontSize: "16px" }}>{v.projectName}</div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  className={classes.icon}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    window.location.href = `/project/edit?projectName=${v.projectName}`;
                  }}
                >
                  <Settings
                    style={{
                      width: "20px",
                      height: "20px",
                      marginRight: "4px",
                    }}
                  />
                </div>
                <div
                  className={classes.icon}
                  onClick={async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    let result = await Swal.fire({
                      title: "Delete Project",
                      text: `Are you sure delete ${v.projectName} Project?`,
                      icon: "warning",
                      heightAuto: false,
                      showCancelButton: true,
                      confirmButtonText: "Yes",
                      cancelButtonText: "No",
                    });
                    if (result.isConfirmed) {
                      let resultData = await fetch(
                        `/api/project?projectName=${v.projectName}`,
                        {
                          method: "DELETE",
                          mode: "cors",
                          credentials: "same-origin",
                          headers: {
                            "Content-Type": "application/json",
                          },
                        }
                      ).then((res) => res.json());

                      if (resultData.code / 100 === 2) {
                        Swal.fire({
                          title: "SUCCESS",
                          text: `DELETE ${v.projectName}`,
                          icon: "success",
                          heightAuto: false,
                        }).then(() => {
                          window.location.reload();
                        });
                      } else {
                        Swal.fire({
                          title: "ERROR",
                          html: `
                                                ERROR in DELETE ${v.projectName}
                                                <br />
                                                <span>${
                                                  resultType[resultData.code]
                                                }</span>
                                            `,
                          icon: "error",
                          heightAuto: false,
                        });
                      }
                    }
                  }}
                >
                  <DeleteForever style={{ width: "20px", height: "20px" }} />
                </div>
              </div>
            </div>
            <div
              style={{
                marginBottom: "3px",
                display: "flex",
              }}
            >
              <div style={{ width: "90px" }}>Author</div>
              <div></div>
            </div>
            <div
              style={{
                marginBottom: "3px",
                display: "flex",
              }}
            >
              <div style={{ width: "90px" }}>Creator</div>
              <div>{v.projectCreator}</div>
            </div>
            <div
              style={{
                marginBottom: "3px",
                display: "flex",
              }}
            >
              <div style={{ width: "90px" }}>Create time</div>
              <div>2021-08-28</div>
            </div>
            <div
              style={{
                marginBottom: "3px",
                display: "flex",
              }}
            >
              <div style={{ width: "90px" }}>Description</div>
              <div>{v.projectDescription}</div>
            </div>
            <div className={classes.buttonGroup} style={{ marginTop: "8px" }}>
              <div
                className={classes.button}
                style={{
                  height: "28px",
                  textAlign: "center",
                  fontSize: "14px",
                  lineHeight: "28px",
                }}
                onClick={() => {
                  window.location.href = `/code?projectName=${v.projectName}`;
                }}
              >
                To Code
              </div>
              <div
                className={classes.button}
                style={{
                  height: "28px",
                  textAlign: "center",
                  fontSize: "14px",
                  lineHeight: "28px",
                }}
                onClick={() => {
                  window.location.href = `/manage?projectName=${v.projectName}`;
                }}
              >
                To Issue
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
