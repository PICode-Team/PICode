import React, { useEffect } from "react";
import { createProjectStyle } from "../../../styles/service/project/createtmp"
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import PublishIcon from '@material-ui/icons/Publish';
import GitHubIcon from '@material-ui/icons/GitHub';
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';

interface TSource {
    gitUrl?: string;
    upload?: {
        uploadFileId: string;
        isExtract?: boolean;
    };
}

interface TProjectInfo {
    projectName: string;
    projectDescription: string,
    projectThumbnail: string,
    projectParticipants: string[]

}

interface TCreate {
    projectInfo: TProjectInfo, source?: TSource
}


const DefualtInput = ({ classes, setDefualtInput, defaultInput }: any) => {
    const [upload, setUpload] = React.useState<boolean>(false);

    return <div className={classes.content}>
        <div className={classes.title}>
            Write Information of project
        </div>
        <div className={classes.inputContent}>
            <span>Project ID</span>
            <input placeholder="Input Project Name" onChange={(e) => {
                setDefualtInput({ ...defaultInput, projectName: e.target.value })
            }} value={defaultInput.projectName} />
            <span>Project Description</span>
            <textarea rows={10} placeholder="Input Project Description" onChange={(e) => {
                setDefualtInput({ ...defaultInput, projectDescription: e.target.value })
            }} value={defaultInput.projectDescription} />
            <span>Project Thumbnail</span>
            <div className={classes.imageUpload} onDragOver={() => {
                setUpload(true);
            }}
                onDragLeave={() => {
                    setUpload(false)
                }}
            >
                {upload ?
                    <div style={{ textAlign: "center" }} >
                        <InsertPhotoIcon style={{ width: "40px", height: "40px" }} />
                        <br />
                        <span >Drop Image</span>
                    </div> :
                    <>
                        <div style={{ textAlign: "center" }} >
                            <CloudUploadIcon style={{ width: "40px", height: "40px" }} />
                            <br />
                            <span >Drag and Drop Image or Click to upload Image</span>
                            <input type="file" style={{ display: "none" }} />
                        </div>
                        <input type="file" id="getFile" onChange={(e) => {
                            setDefualtInput({ ...defaultInput, projectThumbnail: e.target.value })
                        }} />
                    </>}
            </div>
            <span>Project Participant</span>
            <input placeholder="Input Project ID" />
        </div>
    </div>
}

const OptionalInput = ({ type, classes, setSource, source }: any) => {
    if (type === "git") {
        return <>
            <div className={classes.title}>
                Input Optional info about git
            </div>
            <div className={classes.inputContent}>
                <span>Project ID</span>
                <input placeholder="Input Github Url" onChange={(e) => {
                    setSource({ ...source, gitUrl: e.target.value })
                }} value={source.gitUrl} />
            </div>
        </>
    } else if (type === "upload") {
        return <>
            <div className={classes.title}>
                Input Optional info about Upload
            </div>
            <div className={classes.inputContent}>
                <span>Project ID</span>
                <input placeholder="Upload File" onChange={(e) => {
                    setSource({ ...source.upload, uploadFileId: e.target.value })
                }} value={source.gitUrl} />
                <span>Project ID</span>
                <input placeholder="If you want extract file input `yes`" onChange={(e) => {
                    setSource({ ...source.upload, isExtract: e.target.value === "yes" ? true : false })
                }} value={source.gitUrl} />
            </div>
        </>
    } else {
        return <></>
    }
}

export default function CreateTmp() {
    const classes = createProjectStyle();
    const [type, setType] = React.useState<string>("");
    const [defaultInput, setDefualtInput] = React.useState<TProjectInfo>({
        projectDescription: "",
        projectName: "",
        projectParticipants: [],
        projectThumbnail: ""
    })
    const [source, setSource] = React.useState<TSource>({})

    useEffect(() => {
        if (type === "git") {
            setSource({
                gitUrl: ""
            })
        } else if (type === "upload") {
            setSource({
                upload: {
                    uploadFileId: "",
                    isExtract: true
                }
            })
        }
    }, [type])

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
                <div className={classes.button} onClick={() => console.log(source, defaultInput)}>SUBMIT</div>
            </div>
        }
    </div>
}