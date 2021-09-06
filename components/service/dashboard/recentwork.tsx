/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import {
  Grid,
  IconButton,
  Slider,
  Switch,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import { useEffect } from "react";
import AddIcon from "@material-ui/icons/Add";
import { recentWorkStyle } from "../../../styles/service/dashboard/recentwork";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { DeleteForever, Settings } from "@material-ui/icons";
import DeleteIcon from "@material-ui/icons/Delete";
import Swal from "sweetalert2";

import * as d3 from "d3";
import { resultType } from "../../constant/fetch/result";
interface IProjectData {
  projectName: string;
  projectDescription: string;
  language: string;
  projectCreator: string;
  projectParticipants: string[];
  projectThumbnail?: string;
}

export default function RecentWork() {
  const classes = recentWorkStyle();
  const [projectData, setProjectData] = useState<IProjectData[]>([]);
  const [state, setState] = useState<boolean>(true);
  const [sliderNum, setSliderNum] = useState<number | number[]>(3);
  const [content, setContent] = useState<any>();
  const [openProject, setOpenProject] = useState<boolean>(false);
  const [itemNum, setItemNum] = useState<number>(0);

  const handleChange = () => {
    setState(!state);
  };

  useEffect(() => {}, [sliderNum]);

  const drawTableView = () => {
    let width = (d3.select("#view")?.node() as any)?.getBoundingClientRect()
      .width;
    let col = width / Number(sliderNum) - 20;
    let tmpContent = [
      <div
        key={`project-table-${uuidv4()}`}
        style={{
          padding: "20px",
          width: col + "px",
          height: "200px",
          display: "inline-block",
        }}
      >
        <div className={classes.carouselContent}>
          <div style={{ textAlign: "center" }}>
            <div
              onClick={() => {
                window.location.href = "/project/create";
              }}
            >
              <AddIcon style={{ color: "#ffffff" }} />
            </div>
            <span
              style={{ display: "block", textAlign: "center", color: "#fff" }}
            >
              Create Project
            </span>
          </div>
        </div>
      </div>,
    ];
    for (let i of projectData) {
      tmpContent.push(
        <div
          key={`project-table-${uuidv4()}`}
          style={{
            padding: "20px",
            width: col + "px",
            height: "200px",
            display: "inline-block",
          }}
        >
          <div className={classes.carouselContent}>
            <div style={{ textAlign: "center" }}>
              <span className={classes.tableContent}>
                {i.projectDescription}
              </span>
              <span className={classes.tableContent}>{i.projectName}</span>
              <span className={classes.tableContent}>{i.projectCreator}</span>
            </div>
          </div>
        </div>
      );
    }
    return tmpContent;
  };

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

  let uuidv4 = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  };

  let drawCarouselView = () => {
    let tmpContent = [
      <div
        key={`addProject-${uuidv4()}`}
        style={{ padding: "0px 20px", height: "100%" }}
      >
        <div
          style={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "12px",
          }}
          className={classes.carouselContent}
        >
          <div style={{ textAlign: "center" }}>
            <IconButton
              className={classes.carouselButton}
              onClick={() => {
                window.location.href = "/project/create";
              }}
            >
              <AddIcon />
            </IconButton>
            <span
              style={{ display: "block", textAlign: "center" }}
              className={classes.carouselButton}
            >
              Create Project
            </span>
          </div>
        </div>
      </div>,
    ];
    for (let i of projectData) {
      let participantsInfo: any = i.projectParticipants;
      if (participantsInfo !== undefined) {
        participantsInfo = participantsInfo.join(", ");
        if (participantsInfo.length > 15) {
          participantsInfo = participantsInfo.substring(0, 15) + "...";
        }
      }

      tmpContent.push(
        <div
          key={`project-carouse-${uuidv4()}`}
          style={{ padding: "0px 20px", height: "100%" }}
        >
          <div className={classes.carouselContent}>
            <div style={{ width: "100%", height: "100%" }}>
              <div className={classes.projectName}>
                <span>{i.projectName}</span>
                <span
                  onClick={(e: any) => {
                    e.stopPropagation();
                    e.preventDefault();
                    window.location.href = `/project/edit?projectName=${i.projectName}`;
                  }}
                  style={{
                    position: "absolute",
                    right: "50px",
                    cursor: "pointer",
                    top: "-25px",
                    zIndex: 999,
                  }}
                >
                  <Settings
                    style={{
                      width: "24px",
                      height: "24px",
                    }}
                  />
                </span>
                <span
                  onClick={async (e: any) => {
                    e.stopPropagation();
                    e.preventDefault();
                    let result = await Swal.fire({
                      title: "Delete Project",
                      text: `Are you sure delete ${i.projectName} Project?`,
                      icon: "warning",
                      heightAuto: false,
                      showCancelButton: true,
                      confirmButtonText: "Yes",
                      cancelButtonText: "No",
                    });
                    if (result.isConfirmed) {
                      let resultData = await fetch(
                        `/api/project?projectName=${i.projectName}`,
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
                          text: `DELETE ${i.projectName}`,
                          icon: "success",
                          heightAuto: false,
                        }).then(() => {
                          window.location.reload();
                        });
                      } else {
                        Swal.fire({
                          title: "ERROR",
                          html: `
                                                ERROR in DELETE ${i.projectName}
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
                  style={{
                    position: "absolute",
                    right: "20px",
                    cursor: "pointer",
                    top: "-25px",
                    zIndex: 999,
                  }}
                >
                  <DeleteForever
                    style={{
                      width: "24px",
                      height: "24px",
                    }}
                  />
                </span>
              </div>

              <div
                className={classes.imageContent}
                style={{
                  top: "20%",
                }}
              >
                {i.projectThumbnail === undefined ? (
                  <img
                    alt="logo"
                    style={{ maxWidth: "80px", maxHeight: "80px" }}
                    src={`/images/picode-7.svg`}
                  />
                ) : (
                  <img
                    alt="logo"
                    style={{ maxWidth: "80px", maxHeight: "80px" }}
                    src={`/api/temp/${i.projectThumbnail}`}
                  />
                )}
              </div>
              <div style={{ width: "100%", height: "35%" }}></div>
              <div
                style={{ paddingTop: "65px" }}
                className={classes.textContent}
                id="textcontent"
              >
                <div
                  style={{
                    width: "100%",
                    padding: "0 25%",
                    height: "calc(100% - 56px)",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "25%",
                      display: "flex",
                      textAlign: "left",
                    }}
                  >
                    <div style={{ width: "60%", fontSize: "16px" }}>Author</div>
                    <div style={{ width: "40%", fontSize: "14px" }}>
                      {participantsInfo ?? "No one"}
                    </div>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: "25%",
                      display: "flex",
                      textAlign: "left",
                    }}
                  >
                    <div style={{ width: "60%", fontSize: "16px" }}>
                      Creator
                    </div>
                    <div style={{ width: "40%", fontSize: "14px" }}>
                      {i.projectCreator}
                    </div>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: "25%",
                      display: "flex",
                      textAlign: "left",
                    }}
                  >
                    <div style={{ width: "60%", fontSize: "16px" }}>
                      Create time
                    </div>
                    <div style={{ width: "40%", fontSize: "14px" }}>
                      2021-08-28
                    </div>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: "25%",
                      display: "flex",
                      textAlign: "left",
                    }}
                  >
                    <div style={{ width: "60%", fontSize: "16px" }}>
                      Project Description
                    </div>
                    <div style={{ width: "40%", fontSize: "14px" }}>
                      {i.projectDescription}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                    padding: "0 100px",
                    paddingBottom: "16px",
                    height: "56px",
                  }}
                >
                  <div className={classes.buttonGroup}>
                    <div
                      className={classes.button}
                      onClick={() => {
                        window.location.href = `/code?projectName=${i.projectName}`;
                      }}
                    >
                      To Code
                    </div>
                    <div
                      className={classes.button}
                      onClick={() => {
                        window.location.href = `/manage?projectName=${i.projectName}`;
                      }}
                    >
                      To Issue
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return tmpContent;
  };

  useEffect(() => {
    let width = (d3.select("#view")?.node() as any)?.getBoundingClientRect()
      .width;
    d3.select(".carousel-root").style("max-width", `${width}px`);
  }, [projectData]);

  useEffect(() => {
    if (state) {
      d3.select("#view").style("overflow-y", "hidden");
    } else {
      d3.select("#view").style("overflow-y", "auto");
    }
  }, [state]);

  return (
    <div className={classes.recentContent}>
      <div className={classes.title}>Recent Work</div>
      <div className={classes.content}>
        <div className={classes.view} id="view">
          {state && (
            <>
              {openProject && (
                <div className={classes.menuDialog}>
                  <div
                    key={0}
                    onClick={() => setItemNum(0)}
                    className={classes.menuDialogRow}
                  >
                    Create Project
                  </div>
                  {projectData.map((v: any, idx: number) => {
                    return (
                      <div
                        key={idx + 1}
                        onClick={() => setItemNum(idx + 1)}
                        className={classes.menuDialogRow}
                      >
                        {v.projectName}
                      </div>
                    );
                  })}
                </div>
              )}
              <IconButton
                className={classes.leftButton}
                onClick={() => {
                  if (itemNum - 1 < 0) {
                    setItemNum(projectData.length);
                  } else {
                    setItemNum(itemNum - 1);
                  }
                }}
              >
                <ArrowBackIosIcon />
              </IconButton>
              <IconButton
                className={classes.rightButton}
                onClick={() => {
                  if (itemNum + 1 > projectData.length) {
                    setItemNum(0);
                  } else {
                    setItemNum(itemNum + 1);
                  }
                }}
              >
                <ArrowBackIosIcon style={{ transform: "rotate(-180deg)" }} />
              </IconButton>
              <Carousel
                showArrows={false}
                selectedItem={itemNum as number}
                showStatus={false}
                showThumbs={false}
                showIndicators={false}
                centerSlidePercentage={50}
                centerMode={true}
                autoPlay={false}
                dynamicHeight={true}
                infiniteLoop
                useKeyboardArrows={true}
              >
                {drawCarouselView().map((v: any) => v)}
              </Carousel>
            </>
          )}
          {!state && drawTableView().map((v: any) => v)}
        </div>
      </div>
    </div>
  );
}
