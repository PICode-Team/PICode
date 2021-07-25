import React, { useEffect, useRef } from "react";
import { createProjectStyle } from "../../../styles/service/project/createtmp"
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import PublishIcon from '@material-ui/icons/Publish';
import GitHubIcon from '@material-ui/icons/GitHub';
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';
import { cloneDeep } from "lodash";

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


const DefualtInput = ({ classes, setDefualtInput, defaultInput }: any) => {
    const [upload, setUpload] = React.useState<boolean>(false);
    const [imageName, setImageName] = React.useState<string>("");

    const fileButton = useRef<any>(null);

    const dragOver = (e: any) => {
        e.preventDefault();
    }

    const dragEnter = (e: any) => {
        e.preventDefault();
        setUpload(true)
    }

    const dragLeave = (e: any) => {
        e.preventDefault();
        setUpload(false)
    }

    const fileDrop = async (e: any) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files !== undefined) {
            setImageName(files[0].name);
            let formData = new FormData();
            formData.append("uploadFile", files[0])
            let result = await fetch(`http://localhost:8000/api/data`, {
                method: "POST",
                body: formData
            }).then((res) => res.json())
            if (result.code === 200) {
                setDefualtInput({ ...defaultInput, projectThumbnail: result.uploadFileId })
            }
        }
    }

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
            <div className={classes.imageUpload}
                onDragOver={dragOver}
                onDragEnter={dragEnter}
                onDragLeave={dragLeave}
                onDrop={fileDrop}
                onClick={() => fileButton.current.click()}
            >
                {upload ?
                    <div style={{ textAlign: "center", pointerEvents: 'none' }} >
                        <InsertPhotoIcon style={{ width: "40px", height: "40px" }} />
                        <br />
                        <span >{imageName !== "" ? imageName : "Drop Image"}</span>
                    </div> :
                    <>
                        <div style={{ textAlign: "center" }}>
                            <CloudUploadIcon style={{ width: "40px", height: "40px" }} />
                            <br />
                            <span >Drag and Drop Image or Click to upload Image</span>
                        </div>
                    </>}
            </div>
            <input
                type="file"
                id="getFile"
                style={{ display: "none" }}
                ref={fileButton}
                onChange={async (e) => {
                    let tmpImage = e.target.files
                    if (tmpImage !== null) {
                        let formData = new FormData();
                        formData.append("uploadFile", tmpImage[0])
                        let result = await fetch(`http://localhost:8000/api/data`, {
                            method: "POST",
                            body: formData
                        }).then((res) => res.json())
                        if (result.code === 200) {
                            setUpload(true)
                            setImageName(tmpImage[0].name);
                            setDefualtInput({ ...defaultInput, projectThumbnail: result.uploadFileId })
                        }
                    }
                }} />
            <span>Project Participant</span>
            <input placeholder="Input project Participane ex)test1,test2,test3... " onChange={(e) => {
                setDefualtInput({ ...defaultInput, projectParticipants: e.target.value })
            }} />
        </div>
    </div >
}

const OptionalInput = ({ type, classes, setSource, source }: any) => {
    const [upload, setUpload] = React.useState<boolean>(false);
    const [fileeName, setFileName] = React.useState<string>("");


    const fileButton = useRef<any>(null);

    const dragOver = (e: any) => {
        e.preventDefault();
    }

    const dragEnter = (e: any) => {
        e.preventDefault();
        setUpload(true)
    }

    const dragLeave = (e: any) => {
        e.preventDefault();
        setUpload(false)
    }

    const fileDrop = async (e: any) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files !== undefined) {
            setFileName(files[0].name);
            let formData = new FormData();
            formData.append("uploadFile", files[0])
            let result = await fetch(`http://localhost:8000/api/data`, {
                method: "POST",
                body: formData
            }).then((res) => res.json())
            if (result.code === 200) {
                let tmpSource = source;
                tmpSource.upload.uploadFileId = result.uploadFileId
                setSource(tmpSource)
            }
        }
    }

    if (type === "git") {
        return <>
            <div className={classes.title}>
                Input Optional info about git
            </div>
            <div className={classes.inputContent}>
                <span>Project ID</span>
                <input placeholder="Input Github Url" onChange={(e) => {
                    setSource({ ...source, gitUrl: e.target.value })
                }} value={source === undefined ? "" : source.gitUrl} />
            </div>
        </>
    } else if (type === "upload") {
        return <>
            <div className={classes.title}>
                Input Optional info about Upload
            </div>
            <div className={classes.inputContent}>
                <span>Project Zip File</span>
                <div className={classes.imageUpload}
                    onDragOver={dragOver}
                    onDragEnter={dragEnter}
                    onDragLeave={dragLeave}
                    onDrop={fileDrop}
                    onClick={() => fileButton.current.click()}
                >
                    {upload ?
                        <div style={{ textAlign: "center", pointerEvents: 'none' }} >
                            <InsertPhotoIcon style={{ width: "40px", height: "40px" }} />
                            <br />
                            <span >{fileeName !== "" ? fileeName : "Drop Image"}</span>
                        </div> :
                        <>
                            <div style={{ textAlign: "center" }}>
                                <CloudUploadIcon style={{ width: "40px", height: "40px" }} />
                                <br />
                                <span >Drag and Drop Image or Click to upload Image</span>
                            </div>
                        </>}
                </div>
                <input
                    ref={fileButton}
                    style={{ display: "none" }}
                    type="file"
                    id="getFile"
                    onChange={async (e) => {
                        let tmpImage = e.target.files
                        if (tmpImage !== null) {
                            let formData = new FormData();
                            formData.append("uploadFile", tmpImage[0])
                            let result = await fetch(`http://localhost:8000/api/data`, {
                                method: "POST",
                                body: formData
                            }).then((res) => res.json())
                            if (result.code === 200) {
                                let tmpSource = source;
                                tmpSource.upload.uploadFileId = result.uploadFileId
                                setSource(tmpSource)
                            }
                        }
                    }} />
                <div style={{ display: "inline-block" }}>
                    is Extract?
                    <input
                        type="checkbox"
                        checked={source.upload ? source.upload.isExtract : true}
                        onClick={(e) => {
                            let tmpSource = cloneDeep(source);
                            tmpSource.upload.isExtract = e.currentTarget.checked
                            setSource(tmpSource)
                        }}
                        style={{ verticalAlign: "middle" }} />
                </div>
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

        console.log(payload)
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