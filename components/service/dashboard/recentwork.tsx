/* eslint-disable @next/next/no-img-element */
import { Grid, IconButton, Slider, Switch, Typography } from "@material-ui/core";
import React, { useState } from "react"
import { Carousel } from 'react-responsive-carousel';
import { useEffect } from "react";
import AddIcon from '@material-ui/icons/Add';
import { recentWorkStyle } from "../../../styles/service/dashboard/recentwork";
import "react-responsive-carousel/lib/styles/carousel.min.css";


import * as d3 from "d3"
interface IProjectData {
    projectId: string;
    description: string;
    language: string;
}

export default function RecentWork() {
    const classes = recentWorkStyle();
    const [projectData, setProjectData] = useState<IProjectData[]>([]);
    const [state, setState] = useState<boolean>(true);
    const [sliderNum, setSliderNum] = useState<number | number[]>(3);
    const [content, setContent] = useState<any>();
    const [itemNum, setItemNum] = useState<number>(0);

    const getProjectData = () => {
        let data: IProjectData[] = [
            {
                projectId: "WebService",
                description: "~~~ 프로젝트",
                language: "React"
            },
            {
                projectId: "WebService",
                description: "~~~ 프로젝트",
                language: "React"
            },
            {
                projectId: "WebService",
                description: "~~~ 프로젝트",
                language: "React"
            },
            {
                projectId: "WebService",
                description: "~~~ 프로젝트",
                language: "React"
            },
            {
                projectId: "WebService",
                description: "~~~ 프로젝트",
                language: "React"
            },
            {
                projectId: "WebService",
                description: "~~~ 프로젝트",
                language: "React"
            }, {
                projectId: "WebService",
                description: "~~~ 프로젝트",
                language: "React"
            }, {
                projectId: "WebService",
                description: "~~~ 프로젝트",
                language: "React"
            }, {
                projectId: "WebService",
                description: "~~~ 프로젝트",
                language: "React"
            }, {
                projectId: "WebService",
                description: "~~~ 프로젝트",
                language: "React"
            }, {
                projectId: "WebService",
                description: "~~~ 프로젝트",
                language: "React"
            },
            {
                projectId: "WebService",
                description: "~~~ 프로젝트",
                language: "React"
            },
            {
                projectId: "WebService",
                description: "~~~ 프로젝트",
                language: "React"
            },
            {
                projectId: "WebService",
                description: "~~~ 프로젝트",
                language: "React"
            },
            {
                projectId: "WebService",
                description: "~~~ 프로젝트",
                language: "React"
            },
            {
                projectId: "WebService",
                description: "~~~ 프로젝트",
                language: "React"
            },
            {
                projectId: "WebService",
                description: "~~~ 프로젝트",
                language: "React"
            },
        ]

        return data;
    }

    const handleChange = () => {
        setState(!state)
    }

    useEffect(() => {

    }, [sliderNum])

    const drawTableView = () => {
        d3.select("#view").style("overflow-y", "scroll")
        let width = (d3.select("#view")?.node() as any)?.getBoundingClientRect().width;
        let col = width / Number(sliderNum) - 20;
        let tmpContent = [<div key={"addProject"} style={{ padding: "20px", width: col + "px", height: "200px", display: "inline-block" }}>
            <div style={{ background: "black", height: "100%", borderRadius: "12px" }}>
                <div style={{ textAlign: "center" }}>
                    <IconButton style={{ color: "#fff" }}>
                        <AddIcon />
                    </IconButton>
                    <span style={{ display: "block", textAlign: "center", color: "#fff" }}>
                        Create Project
                    </span>
                </div>
            </div>
        </div>];
        for (let i of projectData) {
            tmpContent.push(<div key={"addProject"} style={{ padding: "20px", width: col + "px", height: "200px", display: "inline-block" }}>
                <div style={{ background: "black", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "12px" }}>
                    <div style={{ textAlign: "center" }}>
                        <span style={{ display: "block", color: "white" }}>{i.language} 주로 사용</span>
                        <span style={{ display: "block", color: "white" }}>{i.description}</span>
                        <span style={{ display: "block", color: "white" }} className="">{i.projectId}</span>
                    </div>
                </div>
            </div>)
        }
        return tmpContent;
    }

    useEffect(() => {
        setProjectData(getProjectData());
    }, [])

    useEffect(() => {
        let tmpContent = [<div key={"addProject"} style={{ padding: "0px 20px", height: "100%" }}>
            <div style={{ background: "black", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "12px" }}>
                <div style={{ textAlign: "center" }}>
                    <IconButton style={{ color: "#fff" }} onClick={() => { window.location.href = "/createproject" }}>
                        <AddIcon />
                    </IconButton>
                    <span style={{ display: "block", textAlign: "center", color: "#fff" }}>
                        Create Project
                    </span>
                </div>
            </div>
        </div>];
        for (let i of projectData) {
            tmpContent.push(
                <div style={{ padding: "0px 20px", height: "100%" }}>
                    <div style={{ background: "black", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "12px" }}>
                        <div>
                            <span style={{ display: "block", color: "white" }}>{i.language} 주로 사용</span>
                            <span style={{ display: "block", color: "white" }}>{i.description}</span>
                            <span style={{ display: "block", color: "white" }} className="">{i.projectId}</span>
                        </div>
                    </div>
                </div>
            )
        }
        let width = (d3.select("#view")?.node() as any)?.getBoundingClientRect().width;
        d3.select(".carousel-root").style("max-width", `${width}px`)
        setContent(tmpContent);
    }, [projectData])



    return <div className={classes.recentContent}>
        <div className={classes.title}>
            Recent Work
        </div>
        <div className={classes.content}>
            <div className={classes.selectView}>
                <Grid component="label" container alignItems="center" spacing={1}>
                    <Grid item>Table</Grid>
                    <Grid item>
                        <Switch checked={state} onChange={handleChange} name="checkedC" />
                    </Grid>
                    <Grid item>Slider</Grid>
                </Grid>
            </div>

            <div className={classes.view} id="view">
                {state && <>
                    <div style={{ position: "absolute", width: "400px", height: "250px", background: "#fff", zIndex: 3, overflow: "hidden", overflowY: "scroll" }}>
                        <div key={0} onClick={() => setItemNum(0)} style={{ width: "100%", border: "1px solid black", color: "black" }}>Create Project</div>
                        {projectData.map((v: any, idx: number) => {
                            return <div key={idx + 1} onClick={() => setItemNum(idx + 1)} style={{ width: "100%", border: "1px solid black", color: "black" }}>{v.projectId}</div>
                        })}
                    </div>
                    <button style={{ position: "absolute", top: "50%", zIndex: 2, left: "10px" }} onClick={() => {
                        if (itemNum - 1 < 0) {
                            setItemNum(projectData.length)
                        } else {
                            setItemNum(itemNum - 1)
                        }
                    }}>
                        prev
                    </button>
                    <button style={{ position: "absolute", right: "10px", top: "50%", zIndex: 2 }} onClick={() => {
                        if (itemNum + 1 > projectData.length) {
                            setItemNum(0)
                        } else {
                            setItemNum(itemNum + 1)
                        }
                    }}>
                        next
                    </button>
                    <Carousel
                        showArrows={false}
                        selectedItem={itemNum as number}
                        showStatus={false}
                        showThumbs={false}
                        showIndicators={false}
                        centerSlidePercentage={60}
                        centerMode={true}
                        autoPlay={false}
                        dynamicHeight={true}
                        infiniteLoop
                        useKeyboardArrows={true}
                    >
                        {content !== undefined && content.map((v: any) => v)}
                    </Carousel>
                </>}
                {!state && drawTableView().map((v: any) => v)}
            </div>
        </div>
    </div >
}