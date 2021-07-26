/* eslint-disable react-hooks/exhaustive-deps */
import { cloneDeep } from "lodash";
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import Swal from "sweetalert2";
import { createProjectStyle } from "../../../styles/service/project/createtmp";
import { resultType } from "../../constant/fetch/result";
import { DefualtInput } from "./defualt";

interface IEditProject {
    projectDescription: string;
    projectName: string;
    projectParticipants: any;
    projectThumbnail?: string;
}

export default function EditProject() {
    const classes = createProjectStyle();
    const route = useRouter();
    const [projectData, setProjectData] = useState<IEditProject>();

    let getProjectData = async () => {
        let data = await fetch(`/api/project?projectName=${route.query.projectName}`, {
            method: "GET"
        }).then((res) => res.json())
        if (data.projectList.length !== 0) {
            if (data.projectList[0].projectParticipants.length !== 0) {
                data.projectList[0].projectParticipants = data.projectList[0].projectParticipants.join(",")
            } else {
                data.projectList[0].projectParticipants = ""
            }
            setProjectData({
                projectName: data.projectList[0].projectName,
                projectDescription: data.projectList[0].projectDescription,
                projectThumbnail: undefined,
                projectParticipants: data.projectList[0].projectParticipants
            })
        }
    }

    useEffect(() => {
        if (route.query.projectName === undefined) {
            window.location.href = "/"
        } else {
            getProjectData();
        }
    }, [])

    let editData = async () => {
        let realData = cloneDeep(projectData);
        if (realData?.projectParticipants !== undefined) {
            realData.projectParticipants = realData.projectParticipants.split(",")
        }
        let payload = JSON.stringify({ projectInfo: realData, projectName: route.query.projectName })

        let result = await fetch(`/api/project`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json"
            },
            body: payload
        }).then((res) => res.json())
        if (result.code === 200) {
            Swal.fire({
                title: "SUCCESS",
                text: `Edit ${projectData?.projectName}`,
                icon: 'success',
                heightAuto: false,
            }).then(() => {
                window.location.href = "/";
            })
        } else {
            Swal.fire({
                title: "ERROR",
                html:
                    `ERROR Edit ${projectData?.projectName}
                    <br />
                    <span>${resultType[result.code]}</span>`
                ,
                icon: 'error',
                heightAuto: false,
            })
        }
    }

    return <>
        {projectData !== undefined &&
            <div className={classes.root}>
                <div className={classes.header}>
                    {`Edit ${projectData?.projectName}`}
                </div>
                <DefualtInput
                    classes={classes}
                    setDefualtInput={setProjectData}
                    defaultInput={projectData}
                />
                <div className={classes.buttonBox}>
                    <div className={classes.button} onClick={() => window.location.href = "/"}>CANCEL</div>
                    <div className={classes.button} onClick={() => editData()}>EDIT</div>
                </div>
            </div>
        }
    </>
}