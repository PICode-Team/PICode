/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { containerStyle } from "../../../styles/service/container/container";
import * as d3 from "d3";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Icon,
    IconButton,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import LockOpenOutlinedIcon from "@material-ui/icons/LockOpenOutlined";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import RemoveOutlinedIcon from "@material-ui/icons/RemoveOutlined";
import FullscreenOutlinedIcon from "@material-ui/icons/FullscreenOutlined";
import PowerOutlinedIcon from "@material-ui/icons/PowerOutlined";
import { throttle } from "lodash";
import SettingsBackupRestoreOutlinedIcon from "@material-ui/icons/SettingsBackupRestoreOutlined";
import PowerOffOutlinedIcon from "@material-ui/icons/PowerOffOutlined";
import { AddCircle, DeleteForeverOutlined } from "@material-ui/icons";
import Add from "@material-ui/icons/Add";

export default function Contatiner(props: any) {
    const classes = containerStyle();
    const [zoomLock, setZoomLock] = React.useState<boolean>(false);
    const [mouseDown, setMouseDown] = React.useState<any>();
    const [mouseUp, setMouseUp] = React.useState<any>();
    const [dockerData, setDockerData] = React.useState<any>();
    const [openContext, setOpenContext] = React.useState(false);
    const [contextPosition, setContextPosition] = React.useState({
        x: 0,
        y: 0,
    });
    const [contextInformation, setContextInformation] = React.useState<any>();
    const [modal, setModal] = React.useState<boolean>(false);
    const [create, setCreate] = React.useState<boolean>(false);
    const [networkList, setNetworkList] = React.useState<any[]>([]);
    const [name, setName] = React.useState<string>("");
    const [subnet, setSubnet] = React.useState<string>("");
    const [ipRange, setIpRange] = React.useState<string>("");
    const [gateway, setGateway] = React.useState<string>("");
    const dataConvertor: any = {
        container: {
            padding: 240,
            r: 60,
            y: 420,
            name: "containerName",
            id: "containerId",
        },
        port: {
            padding: 200,
            r: 50,
            y: 820,
            name: "outBound",
            id: "outBound",
        },
        network: {
            padding: 200,
            r: 50,
            y: 0,
            name: "name",
            id: "networkId",
        },
    };

    const getNetworkList = async () => {
        await fetch("http://localhost:8000/api/docker/network", {
            method: "GET",
            mode: "cors",
        })
            .then((res) => res.json())
            .then((res) => {
                setNetworkList(res.networkList);
            });
    };

    React.useEffect(() => {
        getNetworkList();
    }, [modal]);

    const getDockerData = async () => {
        let data = await fetch(`http://localhost:8000/api/docker/visualization`, {
            method: "GET"
        }).then((res) => res.json())
        setDockerData(data.dockerVisualInfo);
    };

    useEffect(() => {
        getDockerData();
    }, []);

    useEffect(() => {
        if (dockerData === undefined) return;
        d3.select("#containerView")
            .call(zoom as any)
            .on("dblclick.zoom", null);
        drawContainer();
        drawLine();
        highlightOnNode();
        d3.selectAll("#checkCircle")
            .on("click", (e, d: any) => {
                if (d.type === "port") return;
                if (mouseDown === undefined) {
                    setMouseDown({ ...d, id: d[dataConvertor[d.type].id] });
                } else {
                    if (mouseDown.id === d[dataConvertor[d.type].id]) {
                        setMouseDown(undefined);
                    } else {
                        if (mouseDown.type === "network" && mouseUp.type === "network")
                            return;
                        setMouseUp({ ...d, id: d[dataConvertor[d.type].id] });
                    }
                }
            })
            .attr("fill", (d: any) => {
                if (
                    mouseDown !== undefined &&
                    d[dataConvertor[d.type].id] === mouseDown.id
                ) {
                    return "black";
                }
                if (
                    mouseUp !== undefined &&
                    d[dataConvertor[d.type].id] === mouseUp.id
                ) {
                    return "black";
                }
                return "grey";
            })
            .attr("stroke", "#fff");
    }, [dockerData]);

    useEffect(() => {
        if (zoomLock) {
            d3.select("#containerView").on(".zoom", null);
        } else {
            d3.select("#containerView").call(zoom as any);
        }

        let container = d3.select("#containerView").select("g");
    }, [zoomLock]);

    const connectContainer = async (payload: any) => {
        let data = await fetch(`http://localhost:8000/api/docker/visualization`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            mode: "cors",
            body: JSON.stringify(payload),
        }).then((res) => res.json());
        if (data.code === 200) {
            getDockerData();
        }
    };

    useEffect(() => {
        if (!modal) {
            setMouseDown(undefined);
            setMouseUp(undefined)
        }
    }, [modal])

    useEffect(() => {
        if (mouseDown !== undefined && mouseUp !== undefined) {
            let payload;
            if (mouseDown.type === "network" && mouseUp.type === "container") {
                payload = {
                    containerId: `${mouseUp.containerId}`,
                    dockerInfo: {
                        bridgeName: `${mouseDown.name}`,
                        bridgeAlias: "testBridge",
                        connect: true,
                    },
                };
                connectContainer(payload);
                setMouseDown(undefined);
                setMouseUp(undefined);
            } else if (mouseDown.type === "container" && mouseUp.type === "network") {
                payload = {
                    containerId: `${mouseDown.containerId}`,
                    dockerInfo: {
                        bridgeName: `${mouseUp.name}`,
                        bridgeAlias: "testBridge",
                        connect: true,
                    },
                };
                connectContainer(payload);
                setMouseDown(undefined);
                setMouseUp(undefined);
            } else {
                setCreate(false);
                setModal(true);
            }
            //선 연결 코드
        } else {
            d3.selectAll("#checkCircle")
                .on("click", (e, d: any) => {
                    if (d.type === "port") return;
                    if (mouseDown === undefined) {
                        setMouseDown({ ...d, id: d[dataConvertor[d.type].id] });
                    } else {
                        if (mouseDown.id === d[dataConvertor[d.type].id]) {
                            setMouseDown(undefined);
                        } else {
                            if (mouseDown.type === "network" && mouseUp.type === "network")
                                return;
                            setMouseUp({ ...d, id: d[dataConvertor[d.type].id] });
                        }
                    }
                })
                .attr("fill", (d: any) => {
                    if (
                        mouseDown !== undefined &&
                        d[dataConvertor[d.type].id] === mouseDown.id
                    ) {
                        return "black";
                    }
                    if (
                        mouseUp !== undefined &&
                        d[dataConvertor[d.type].id] === mouseUp.id
                    ) {
                        return "black";
                    }
                    return "grey";
                })
                .attr("stroke", "#fff");
        }
    }, [mouseDown, mouseUp]);

    function handleZoom(e: any) {
        d3.select("#containerView")
            .select("g")
            .on("dblclick.zoom", null)
            .attr("transform", e.transform);
    }
    const imageType = (type: string, imageType?: string) => {
        if (imageType === undefined) {
            return type === "port" ? "/images/port.svg" : "/images/network.svg";
        } else {
            let dataType: { [key: string]: string } = {
                ubuntu: "/images/serverImage/ubuntu.png",
                centos: "/images/serverImage/centos.png",
            };
            let result = dataType[imageType];
            return result === undefined ? "/images/serverImage/computer.svg" : result;
        }
    };
    let zoom = d3.zoom().scaleExtent([0.25, 10]).on("zoom", handleZoom);

    const getWidthSize = () => {
        let contentWidth = 0;
        let dataType = "";
        for (let type in dockerData) {
            let tmpWidth = 0;
            if (dockerData[type].length < 2) {
                tmpWidth = dockerData[type].length * (dataConvertor[type].r * 2);
            } else {
                tmpWidth =
                    (dockerData[type].length - 1) * dataConvertor[type].padding +
                    dataConvertor[type].r * 2;
            }
            if (contentWidth < tmpWidth) {
                contentWidth = tmpWidth;
                dataType = type;
            }
        }
        return { width: contentWidth, type: dataType };
    };

    const drawContainer = () => {
        let container = d3.select("#containerView").select("g");

        container
            .append("defs")
            .append("marker")
            .attr("id", "arrow")
            .attr("viewBox", "[0, 0, 10, 10]")
            .attr("refX", 5)
            .attr("refY", 5)
            .attr("markerWidth", 10)
            .attr("markerHeight", 10)
            .attr("orient", "auto-start-reverse")
            .append("path")
            .attr(
                "d",
                (d3 as any).line()([
                    [0, 0],
                    [0, 10],
                    [10, 5],
                ])
            )
            .attr("stroke", "#fff")
            .attr("fill", "#fff");

        container.attr("transform", "translate(0,0) scale(1)")
        container.selectAll("g").remove();
        container.selectAll("line").remove()

        let widthResult = getWidthSize();

        for (let type in dockerData) {
            let tmpNum = 0;
            for (let node of dockerData[type]) {
                let conCircle = container
                    .append("g")
                    .attr("id", node[dataConvertor[type].id])
                    .datum({ ...node, type: type })
                    .on("mouseover", (e, d) => {
                        container.selectAll("g").attr("opacity", 0.3);
                        container.selectAll("line").attr("opacity", 0.3);

                        d3.select(`[id="${d[dataConvertor[type].id]}"]`).attr("opacity", 1);

                        if (type === "container") {
                            for (let port in d.portInfo) {
                                d3.select(`[id="${port}"]`).attr("opacity", 1);
                            }
                            for (let bridge in d.bridgeInfo) {
                                const realName = dockerData.network.find(
                                    (v: any) => v.name === bridge
                                );
                                if (realName !== undefined) {
                                    d3.select(`[id="${realName.networkId}"]`).attr("opacity", 1);
                                }
                            }
                            for (let i of node.containers) {
                                let linkcon = dockerData.container.find(
                                    (v: any) => v.containerName === i
                                );
                                if (linkcon !== undefined) {
                                    d3.select(`[id="${linkcon.containerId}"]`).attr("opacity", 1);
                                }
                            }
                        } else if (type === "port") {
                            for (let i of d.connectedContainers) {
                                d3.select(`[id="${i}"]`).attr("opacity", 1);
                            }
                            d3.select(`[id="${d.onContainer}"]`).attr("opacity", 1);
                        } else {
                            for (let i of d.containers) {
                                d3.select(`[id="${i}"]`).attr("opacity", 1);
                            }
                        }

                        d3.selectAll("line")
                            .filter((tmp: any) => {
                                if (
                                    tmp.source === String(d[dataConvertor[type].id]) ||
                                    tmp.target === String(d[dataConvertor[type].id])
                                ) {
                                    return true;
                                }
                                return false;
                            })
                            .attr("opacity", 1);
                    })
                    .on("contextmenu", (e, d) => {
                        e.preventDefault();
                        setContextPosition({ x: e.clientX, y: e.clientY });
                        setOpenContext(true);
                        setContextInformation(d);
                    })
                    .on("mouseout", () => {
                        container.selectAll("g").attr("opacity", 1);
                        container.selectAll("line").attr("opacity", 1);
                    });
                let x =
                    type !== widthResult.type
                        ? (widthResult.width / (dockerData[type].length + 1)) *
                        (tmpNum + 1) -
                        dataConvertor[type].r
                        : tmpNum * dataConvertor[type].padding;
                let r = dataConvertor[type].r;
                let y = dataConvertor[type].y;
                if (type === "container") {
                    y = tmpNum % 2 === 0 ? y + r : y - r;
                }

                conCircle
                    .append("svg:image")
                    .attr("width", r)
                    .attr("height", r)
                    .attr(
                        "xlink:href",
                        imageType(type, node.image !== undefined ? node.image : undefined)
                    )
                    .attr("x", x - r / 2)
                    .attr("y", () => {
                        return y - r / 2;
                    });

                conCircle
                    .append("circle")
                    .attr("id", "nodeCircle")
                    .attr("r", r)
                    .attr("fill", "none")
                    .attr("stroke", "#fff")
                    .attr("stroke-width", "3")
                    .attr("cx", x)
                    .attr("cy", () => {
                        return y;
                    });
                conCircle
                    .append("text")
                    .text(node[dataConvertor[type].name])
                    .style("text-anchor", "middle")
                    .style("fill", "#fff")
                    .attr("x", x)
                    .attr("y", y + r + 20)
                    .style("pointer-events", "none")
                    .style("user-select", "none");

                conCircle
                    .append("circle")
                    .attr("id", `checkCircle`)
                    .datum({ ...node, type: type })
                    .attr("r", 5)
                    .attr("cx", x)
                    .attr("cy", () => {
                        return y - r;
                    })
                    .attr("fill", "grey")
                    .attr("stroke", "#fff");

                conCircle
                    .append("circle")
                    .attr("id", `checkCircle`)
                    .datum({ ...node, type: type })
                    .attr("r", 5)
                    .attr("cx", x)
                    .attr("cy", () => {
                        return y + r;
                    })
                    .attr("fill", "grey")
                    .attr("stroke", "#fff");

                tmpNum++;
            }
        }
    };

    function markerStyle(color?: string) {
        let marker = d3.select("#containerView").select("g").select("defs");
        marker
            .append("marker")
            .attr("id", "arrow" + color ?? "")
            .attr("viewBox", "[0, 0, 10, 10]")
            .attr("refX", 5)
            .attr("refY", 5)
            .attr("markerWidth", 10)
            .attr("markerHeight", 10)
            .attr("orient", "auto-start-reverse")
            .append("path")
            .attr(
                "d",
                (d3 as any).line()([
                    [0, 0],
                    [0, 10],
                    [10, 5],
                ])
            )
            .attr("stroke", color !== undefined ? color : "#fff")
            .attr("fill", color !== undefined ? color : "#fff");
    }

    const highlightOnNode = () => {
        markerStyle("green");
        markerStyle("red");
        markerStyle("yellow");

        for (let i of dockerData.port) {
            if (i.onContainer !== undefined) {
                let port = d3.select(`[id="${i.outBound}"]`);

                port.select("#nodeCircle").attr("stroke", "green");

                let node = d3.select(`[id="${i.onContainer}"]`);

                node.select("#nodeCircle").attr("stroke", "green");
                let line = d3.selectAll("line").filter((d: any) => {
                    if (d.source === String(i.outBound) && d.target === i.onContainer) {
                        return true;
                    }
                    return false;
                });
                line
                    .style("stroke", "green")
                    .attr("marker-end", "url(#arrowgreen)")
                    .attr("marker-start", "url(#arrowgreen)");
                for (let tmpNode of i.connectedContainers) {
                    if (tmpNode !== i.onContainer) {
                        let downNode = d3.select(`[id="${tmpNode}"]`);
                        downNode.select("#nodeCircle").attr("stroke", "red");
                        let line = d3.select(`[id="${i.outBound}:${tmpNode}"]`);
                        line
                            .style("stroke", "red")
                            .attr("marker-end", "url(#arrowred)")
                            .attr("marker-start", "url(#arrowred)");
                    }
                }
            }
        }
    };

    const drawLine = () => {
        let container = d3.select("#containerView").select("g");
        let makeLine: any = [];
        for (let node of dockerData.container) {
            for (let port in node.portInfo) {
                let startPoint = d3.select(`[id="${port}"]`).node();
                let endPoint = d3.select(`[id="${node.containerId}"]`).node();
                if (startPoint !== null && endPoint !== null) {
                    d3.select("#containerView")
                        .select("g")
                        .append("line")
                        .datum({
                            source: port,
                            target: node.containerId,
                        })
                        .attr("id", `${port}:${node.containerId}`)
                        .style("stroke", "#fff")
                        .style("stroke-width", 1.5)
                        .attr("x1", (startPoint as any).getBoundingClientRect().x - 30)
                        .attr("y1", (startPoint as any).getBoundingClientRect().y - 120)
                        .attr("x2", (endPoint as any).getBoundingClientRect().x - 30)
                        .style("stroke-dasharray", "10, 4")
                        .attr("y2", (endPoint as any).getBoundingClientRect().y + 40)
                        .attr("marker-end", "url(#arrow)")
                        .attr("marker-start", "url(#arrow)");
                }
            }
            for (let bridge in node.bridgeInfo) {
                const realName = dockerData.network.find((v: any) => v.name === bridge);
                if (realName !== undefined) {
                    let startPoint = d3.select(`[id="${realName.networkId}"]`).node();
                    let endPoint = d3.select(`[id="${node.containerId}"]`).node();
                    if (startPoint !== null && endPoint !== null) {
                        d3.select("#containerView")
                            .select("g")
                            .append("line")
                            .datum({
                                source: realName.networkId,
                                target: node.containerId,
                            })
                            .attr("id", `${realName.networkId}:${node.containerId}`)
                            .style("stroke", "#fff")
                            .style("stroke-dasharray", "10, 4")
                            .style("stroke-width", 1)
                            .attr("x1", (startPoint as any).getBoundingClientRect().x - 30)
                            .attr("y1", (startPoint as any).getBoundingClientRect().y + 20)
                            .attr("x2", (endPoint as any).getBoundingClientRect().x - 30)
                            .attr("y2", (endPoint as any).getBoundingClientRect().y - 120)
                            .attr("marker-end", "url(#arrow)")
                            .attr("marker-start", "url(#arrow)");
                    }
                }
            }
            for (let connectNode of node.containers) {
                let tmpNode = dockerData.container.find(
                    (v: any) => v.containerName === connectNode
                );
                let checkIs = false;
                if (makeLine.length !== 0) {
                    for (let i of makeLine) {
                        if (
                            i.target === tmpNode.containerId &&
                            i.source === node.containerId
                        ) {
                            checkIs = true;
                        }
                    }
                }
                if (node !== null && !checkIs) {
                    let startPoint = d3.select(`[id="${tmpNode.containerId}"]`).node();
                    let endPoint = d3.select(`[id="${node.containerId}"]`).node();
                    if (startPoint !== null && endPoint !== null) {
                        makeLine.push({
                            source: tmpNode.containerId,
                            target: node.containerId,
                        });
                        let lineGenrator = d3.line().curve(d3.curveNatural);
                        const points: any = [
                            [
                                (startPoint as any).getBoundingClientRect().x - 175,
                                (startPoint as any).getBoundingClientRect().y,
                            ],
                            [
                                (endPoint as any).getBoundingClientRect().x - 200,
                                (endPoint as any).getBoundingClientRect().y,
                            ],
                        ];
                        let pathData = lineGenrator(points);
                        d3.select("#containerView")
                            .select("g")
                            .append("line")
                            .datum({ source: tmpNode.containerId, target: node.containerId })
                            .attr("fill", "none")
                            .attr("id", `${tmpNode.containerId}:${node.containerId}`)
                            .style("stroke", "#fff")
                            .style("stroke-dasharray", "10, 4")
                            .style("stroke-width", 1)
                            .attr("x1", (startPoint as any).getBoundingClientRect().x - 100)
                            .attr("y1", (startPoint as any).getBoundingClientRect().y - 40)
                            .attr("x2", (endPoint as any).getBoundingClientRect().x + 40)
                            .attr("y2", (endPoint as any).getBoundingClientRect().y - 65)
                            .attr("marker-end", "url(#arrow)")
                            .attr("marker-start", "url(#arrow)");
                    }
                }
            }
        }

        animate();

        function animate() {
            container
                .selectAll("line")
                .transition()
                .duration(1000)
                .ease(d3.easeLinear)
                .styleTween("stroke-dashoffset", () => {
                    return d3.interpolate(0, 14) as any;
                })
                .on("end", animate);
        }
    };

    const zoomAppend = () => {
        d3.select("#containerView")
            .transition()
            .call((zoom as any).scaleBy, 1.5);
    };

    const zoomDecr = () => {
        d3.select("#containerView")
            .transition()
            .call((zoom as any).scaleBy, 2 / 3);
    };

    const initCenter = () => {
        let test = d3.select("#containerView").select("g");
    };

    const toCenter = () => {
        let node: any = d3.select("#containerView").node();
        let g: any = d3.select("#containerView").select("g").node();
        if (node !== null && g !== null) {
            let content = g.getBoundingClientRect();
            let width = node.getBoundingClientRect().width;
            let height = node.getBoundingClientRect().height;

            d3.select("#containerView")
                .transition()
                .call((zoom as any).translateTo, 0.5 * width, content.height / 2);
        }
    };

    return (
        <div className={classes.root}>
            <div className={classes.content}>
                <svg
                    id="containerView"
                    style={{ width: "100%", height: "100%" }}
                    onClick={() => {
                        setOpenContext(false);
                    }}
                >
                    <g />
                </svg>
                <div className={classes.buttonWrapper}>
                    <div className={classes.buttonContent}>
                        <IconButton
                            className={classes.buttonHolder}
                            onClick={() => {
                                setCreate(true);
                                setModal(true);
                            }}
                        >
                            <AddCircle className={classes.button} />
                        </IconButton>
                        <div className={classes.divideLine} />
                        <IconButton
                            className={classes.buttonHolder}
                            onClick={() => {
                                setZoomLock(!zoomLock);
                            }}
                        >
                            {!zoomLock ? (
                                <LockOutlinedIcon className={classes.button} />
                            ) : (
                                <LockOpenOutlinedIcon className={classes.button} />
                            )}
                        </IconButton>
                        <div className={classes.divideLine} />
                        <IconButton
                            className={classes.buttonHolder}
                            onClick={() => {
                                if (!zoomLock) {
                                    zoomAppend();
                                }
                            }}
                        >
                            <AddOutlinedIcon className={classes.button} />
                        </IconButton>
                        <div className={classes.divideLine} />
                        <IconButton
                            className={classes.buttonHolder}
                            onClick={() => {
                                if (!zoomLock) {
                                    zoomDecr();
                                }
                            }}
                        >
                            <RemoveOutlinedIcon className={classes.button} />
                        </IconButton>
                        <div className={classes.divideLine} />
                        <IconButton
                            className={classes.buttonHolder}
                            onClick={() => {
                                if (!zoomLock) {
                                    toCenter();
                                }
                            }}
                        >
                            <FullscreenOutlinedIcon className={classes.button} />
                        </IconButton>
                    </div>
                </div>
            </div>
            {openContext &&
                contextInformation !== undefined &&
                contextInformation.type !== "port" && (
                    <div
                        className={classes.context}
                        onBlur={() => {
                            setOpenContext(false);
                        }}
                        style={{
                            top: contextPosition.y,
                            left: contextPosition.x,
                        }}
                    >
                        <div
                            style={{
                                width: "100%",
                                fontSize: "18px",
                                lineHeight: "30px",
                                height: "30px",
                                borderBottom: "1px solid #fff",
                            }}
                        >
                            {contextInformation[dataConvertor[contextInformation.type].name]}
                        </div>
                        {contextInformation.type === "container" && (
                            <div
                                style={{
                                    display: "flex",
                                    height: "45px",
                                    padding: "0 10px",
                                    fontSize: "15px",
                                    lineHeight: "45px",
                                    justifyContent: "space-around",
                                }}
                            >
                                <div
                                    style={{
                                        height: "45px",
                                        fontSize: "15px",
                                        lineHeight: "45px",
                                        display: "inline-block",
                                    }}
                                >
                                    Power
                                </div>
                                <div
                                    style={{
                                        height: "45px",
                                        width: "100%",
                                        lineHeight: "45px",
                                        display: "flex",
                                        justifyContent: "flex-end",
                                    }}
                                >
                                    {contextInformation.status === "exited" && (
                                        <IconButton
                                            style={{ padding: 0 }}
                                            onClick={async () => {
                                                let payload = {
                                                    containerId: contextInformation.containerId,
                                                    dockerCommand: "start",
                                                };
                                                let data = await fetch(
                                                    `http://localhost:8000/api/docker`,
                                                    {
                                                        method: "POST",
                                                        mode: "cors",
                                                        headers: {
                                                            "Content-Type": "application/json",
                                                        },
                                                        body: JSON.stringify(payload),
                                                    }
                                                ).then((res) => res.json());
                                                if (data.code === 200) {
                                                    getDockerData();
                                                }
                                            }}
                                        >
                                            <PowerOutlinedIcon className={classes.icon} />
                                        </IconButton>
                                    )}
                                    {contextInformation.status === "running" && (
                                        <IconButton
                                            style={{ padding: 0 }}
                                            onClick={async () => {
                                                let payload = {
                                                    containerId: contextInformation.containerId,
                                                    dockerCommand: "stop",
                                                };
                                                let data = await fetch(
                                                    `http://localhost:8000/api/docker`,
                                                    {
                                                        method: "POST",
                                                        mode: "cors",
                                                        headers: {
                                                            "Content-Type": "application/json",
                                                        },
                                                        body: JSON.stringify(payload),
                                                    }
                                                ).then((res) => res.json());
                                                if (data.code === 200) {
                                                    getDockerData();
                                                }
                                            }}
                                        >
                                            <PowerOffOutlinedIcon className={classes.icon} />
                                        </IconButton>
                                    )}
                                    <IconButton
                                        style={{ padding: 0 }}
                                        onClick={async () => {
                                            let payload = {
                                                containerId: contextInformation.containerId,
                                                dockerCommand: "restart",
                                            };
                                            let data = await fetch(
                                                `http://localhost:8000/api/docker`,
                                                {
                                                    method: "POST",
                                                    mode: "cors",
                                                    headers: {
                                                        "Content-Type": "application/json",
                                                    },
                                                    body: JSON.stringify(payload),
                                                }
                                            ).then((res) => res.json());
                                            if (data.code === 200) {
                                                getDockerData();
                                            }
                                        }}
                                    >
                                        <SettingsBackupRestoreOutlinedIcon
                                            className={classes.icon}
                                        />
                                    </IconButton>
                                </div>
                            </div>
                        )}
                        {contextInformation.type === "network" && (
                            <div
                                style={{
                                    height: "45px",
                                    width: "100%",
                                    padding: "0 10px",
                                    lineHeight: "45px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <div
                                    style={{
                                        height: "45px",
                                        fontSize: "15px",
                                        lineHeight: "45px",
                                    }}
                                >
                                    Delete
                                </div>
                                <IconButton
                                    onClick={async () => {
                                        let data = await fetch(
                                            `http://localhost:8000/api/docker/network?networkName=${contextInformation.name}`,
                                            {
                                                method: "DELETE",
                                                mode: "cors",
                                            }
                                        ).then((res) => res.json());
                                        if (data.code === 200) {
                                            getDockerData();
                                        }
                                    }}
                                >
                                    <DeleteForeverOutlined className={classes.icon} />
                                </IconButton>
                            </div>
                        )}
                    </div>
                )}
            {modal && (
                <div>
                    <Dialog
                        className={classes.overlay}
                        open={modal}
                        onClose={() => setModal(false)}
                        aria-labelledby="form-dialog-title"
                    >
                        <DialogTitle
                            style={{
                                backgroundColor: "#2c3239",
                                color: "#ffffff",
                                padding: "30px 30px 0px 30px",
                                borderTopLeftRadius: "8px",
                                borderTopRightRadius: "8px",
                            }}
                            id="form-dialog-title"
                        >
                            {create ? "Create" : "Connect"} Network
                        </DialogTitle>
                        <DialogContent
                            style={{
                                backgroundColor: "#2c3239",
                                color: "#ffffff",
                                padding: "20px 30px",
                                paddingTop: "10px",
                            }}
                        >
                            <DialogContentText
                                style={{ color: "#ffffff", paddingBottom: "20px" }}
                            >
                                To subscribe to this website, please enter your email address
                                here. We will send updates occasionally.
                            </DialogContentText>
                            {create ? (
                                <React.Fragment>
                                    <div style={{ marginBottom: "10px", display: "flex" }}>
                                        <div style={{ width: "80px" }}>name</div>
                                        <input
                                            placeholder={name}
                                            value={name}
                                            style={{
                                                background: "#3b434c",
                                                padding: "4px 8px",
                                                border: "none",
                                                outline: "none",
                                                color: "#ffffff",
                                                width: "300px",
                                            }}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                    <div style={{ marginBottom: "10px", display: "flex" }}>
                                        <div style={{ width: "80px" }}>subnet</div>
                                        <input
                                            placeholder={subnet}
                                            value={subnet}
                                            style={{
                                                background: "#3b434c",
                                                padding: "4px 8px",
                                                border: "none",
                                                outline: "none",
                                                color: "#ffffff",
                                                width: "300px",
                                            }}
                                            onChange={(e) => setSubnet(e.target.value)}
                                        />
                                    </div>
                                    <div style={{ marginBottom: "10px", display: "flex" }}>
                                        <div style={{ width: "80px" }}>ipRange</div>
                                        <input
                                            placeholder={ipRange}
                                            value={ipRange}
                                            style={{
                                                background: "#3b434c",
                                                padding: "4px 8px",
                                                border: "none",
                                                outline: "none",
                                                color: "#ffffff",
                                                width: "300px",
                                            }}
                                            onChange={(e) => setIpRange(e.target.value)}
                                        />
                                    </div>
                                    <div style={{ marginBottom: "10px", display: "flex" }}>
                                        <div style={{ width: "80px" }}>gateway</div>
                                        <input
                                            placeholder={gateway}
                                            value={gateway}
                                            style={{
                                                background: "#3b434c",
                                                padding: "4px 8px",
                                                border: "none",
                                                outline: "none",
                                                color: "#ffffff",
                                                width: "300px",
                                            }}
                                            onChange={(e) => setGateway(e.target.value)}
                                        />
                                    </div>
                                </React.Fragment>
                            ) : (
                                <div
                                    className={classes.select}
                                    style={{ marginBottom: "10px", display: "flex" }}
                                >
                                    <span
                                        style={{
                                            width: "105px",
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        network bridge
                                    </span>
                                    <select
                                        id="bridgeNameSelect"
                                        style={{
                                            flex: 1,
                                            borderRadius: "2px",
                                            color: "#ffffff",
                                            background: "#3b434c",
                                            padding: "4px 8px",
                                            width: "100%",
                                            height: "32px",
                                            outline: "none",
                                            border: "none",
                                        }}
                                    >
                                        {networkList.length > 0 &&
                                            networkList.map((v, i) => (
                                                <option key={`network-option-${i}`} value={v.networkName}>
                                                    {v.networkName}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                            )}
                        </DialogContent>
                        <DialogActions
                            style={{
                                backgroundColor: "#2c3239",
                                color: "#ffffff",
                                padding: "0px 30px 30px 30px",
                                borderBottomLeftRadius: "8px",
                                borderBottomRightRadius: "8px",
                            }}
                        >
                            <div style={{ display: "flex" }}>
                                <button
                                    className={classes.footerButton}
                                    onClick={() => setModal(false)}
                                >
                                    CANCEL
                                </button>
                                <button
                                    className={classes.footerButton}
                                    onClick={async () => {
                                        if (create) {
                                            let payload = {
                                                name: name,
                                                subnet: subnet !== "" ? subnet : undefined,
                                                ipRange: ipRange !== "" ? ipRange : undefined,
                                                gateway: gateway !== "" ? gateway : undefined,
                                            };
                                            let data = await fetch(
                                                `http://localhost:8000/api/docker/network`,
                                                {
                                                    method: "POST",
                                                    mode: "cors",
                                                    headers: {
                                                        "Content-Type": "application/json",
                                                    },
                                                    body: JSON.stringify(payload),
                                                }
                                            );
                                        } else {
                                            let bridgeName = document.getElementById("bridgeNameSelect");
                                            if (bridgeName !== null) {
                                                let result = (bridgeName as any).value;
                                                let payload = {
                                                    containerId: mouseDown.containerId,
                                                    dockerInfo: {
                                                        bridgeName: result,
                                                        bridgeAlias: "TestConnectContainer",
                                                        linkConatiner: mouseUp.containerName,
                                                        connect: true,
                                                    },
                                                };
                                                connectContainer(payload)
                                            }
                                        }

                                        setModal(false);
                                    }}
                                >
                                    SUBMIT
                                </button>
                            </div>
                        </DialogActions>
                    </Dialog>
                </div>
            )}
        </div>
    );
}