import React, { useEffect, useRef } from "react";
import { createProjectStyle } from "../../../styles/service/project/createtmp"
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import PublishIcon from '@material-ui/icons/Publish';
import GitHubIcon from '@material-ui/icons/GitHub';
import { DefualtInput } from "./defualt";
import { OptionalInput } from "./optional";

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
    projectDescription: string,
    projectThumbnail?: string,
    projectParticipants?: any
}

interface TCreate {
    projectInfo: TProjectInfo, source?: TSource
}

export default function CreateTmp() {
    const classes = createProjectStyle();
    const [type, setType] = React.useState<string>("");
    const [defaultInput, setDefualtInput] = React.useState<TProjectInfo>({
        projectDescription: "",
        projectName: "",
        projectParticipants: undefined,
        projectThumbnail: undefined
    })
    const [source, setSource] = React.useState<TSource>()

    useEffect(() => {
        if (type === "git") {
            setSource({
                type: "gitUrl",
                gitUrl: undefined
            })
        } else if (type === "upload") {
            setSource({
                type: "upload",
                upload: {
                    uploadFileId: undefined,
                    isExtract: true
                }
            })
        } else {
            setSource({
                type: "nothing"
            })
        }
    }, [type])

    let submitData = async () => {
        let resultInputData: {
            projectName: string;
            projectDescription: string,
            projectThumbnail?: string,
            projectParticipants?: string[] | string
        } = defaultInput;
        if (defaultInput.projectParticipants !== undefined) {
            resultInputData.projectParticipants = defaultInput.projectParticipants.split(",")
        }

        let payload: TCreate = {
            projectInfo: resultInputData,
            source: source
        }

        let data = await fetch(`http://localhost:8000/api/project`, {
            method: "POST",
            mode: "cors",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }).then((res) => res.json())

        if (data.code === 200) {
            window.location.href = "/"
        }
    }

    return <div className={classes.root}>
        <div className={classes.header}>
            Create Project
        </div>
        {type === "" && <div className={classes.content}>
            <div className={classes.title}>
                Select Project Type
            </div>
            <div className={classes.typeContent}>
                <div className={classes.selectContent} onClick={() => setType("defualt")}>
                    <div className={classes.typeNode}>
                        <CreateNewFolderIcon />
                        <span>
                            Create a Project
                        </span>
                    </div>
                </div>
                <div className={classes.selectContent} onClick={() => setType("git")}>
                    <div className={classes.typeNode}>
                        <GitHubIcon />
                        <span>
                            Clone project in Git
                        </span>
                    </div>
                </div>
                <div className={classes.selectContent} onClick={() => setType("upload")}>
                    <div className={classes.typeNode}>
                        <PublishIcon />
                        <span>
                            Upload your own Project
                        </span>
                    </div>
                </div>
            </div>
        </div>
        }
        {type !== "" && <DefualtInput classes={classes} setDefualtInput={setDefualtInput} defaultInput={defaultInput} />}
        {type !== "" && <OptionalInput type={type} classes={classes} setSource={setSource} source={source} />}
        {type !== "" &&
            <div className={classes.buttonBox}>
                <div className={classes.button} onClick={() => setType("")}>PREV</div>
                <div className={classes.button} onClick={() => submitData()}>SUBMIT</div>
            </div>
        }
    </div>
}