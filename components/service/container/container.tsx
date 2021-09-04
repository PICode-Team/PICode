/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { containerStyle } from "../../../styles/service/container/container";
import * as d3 from "d3"
import { IconButton } from "@material-ui/core";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import LockOpenOutlinedIcon from '@material-ui/icons/LockOpenOutlined';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import RemoveOutlinedIcon from '@material-ui/icons/RemoveOutlined';
import FullscreenOutlinedIcon from '@material-ui/icons/FullscreenOutlined';

export default function Contatiner(props: any) {
    const classes = containerStyle();
    const [zoomLock, setZoomLock] = React.useState<boolean>(false);

    useEffect(() => {
        d3.select("#containerView").call(zoom as any).on("dblclick.zoom", null);
        drawContainer();
        drawLine();
    }, [])

    useEffect(() => {
        if (zoomLock) {
            d3.select("#containerView").on(".zoom", null);
        } else {
            d3.select("#containerView").call(zoom as any)
        }
    }, [zoomLock])

    function handleZoom(e: any) {
        d3.select('#containerView')
            .select("g")
            .on("dblclick.zoom", null)
            .attr('transform', e.transform);
    }

    const dockerData: any = {
        "container": [
            {
                "containerName": "testProject2",
                "image": "ubuntu",
                "tag": "latest",
                "containerId": "f8f244355925bf9b43beeb2ec93a6b4d96f7e1752e04b448372573a92346ddef",
                "status": "running",
                "bridgeInfo": { "testBridge": "testAlias" },
                "containers": [],
                "portInfo": { "1111": 2222, "3333": 4444 },
                "socketPort": 63428,
                "ramUsage": "0.00%\u001b[H0.00%",
                "parent": ["8c3f514d9dbd2216991d6b60c18bcbf524bd721c5a2d40140d72d39996db4f00"]
            },
            {
                "containerName": "testProject4",
                "image": "ubuntu",
                "tag": "latest",
                "containerId": "815e7d0b51a44897476e99edc5348a45c657dd9115c9d83220960cd943c1d813",
                "status": "running",
                "bridgeInfo": { "bridge": "" },
                "containers": [],
                "portInfo": { "1313": 1414 },
                "socketPort": 62083,
                "ramUsage": "0.00%\u001b[H0.00%",
                "parent": ["70ecdf273ef360e4036390ff870c84db1115b8ffcb494597e9384e480afe5442"]
            },
            {
                "containerName": "testProject",
                "image": "ubuntu",
                "tag": "latest",
                "containerId": "1dd43d7d93d5acf7a7747a2cd946b01b66dadb9af263d0f001ffba36ee2ca8df",
                "status": "exited",
                "bridgeInfo": { "testBridge": "testAlias" },
                "containers": ["testProject3"],
                "portInfo": { "1111": 2222 },
                "socketPort": 62321,
                "ramUsage": "0.00%",
                "parent": ["8c3f514d9dbd2216991d6b60c18bcbf524bd721c5a2d40140d72d39996db4f00"]
            },
            {
                "containerName": "testProject6",
                "image": "ubuntu",
                "tag": "latest",
                "containerId": "fbe9ed75526f1e62e8404f2a594287ab59865ec289990061a185e74e54d35973",
                "status": "running",
                "bridgeInfo": { "bridge": "" },
                "containers": [],
                "portInfo": { "12345": 54321, "22222": 33333 },
                "socketPort": 62990,
                "ramUsage": "0.00%",
                "parent": ["70ecdf273ef360e4036390ff870c84db1115b8ffcb494597e9384e480afe5442"]
            },
            {
                "containerName": "testProject5",
                "image": "ubuntu",
                "tag": "latest",
                "containerId": "282d89de768d5772238b333dc5eb8f12d86adaa1b42c5de64c8b17d04708f7c4",
                "status": "running",
                "bridgeInfo": { "bridge": "" },
                "containers": [],
                "portInfo": { "12222": 12222, "13131": 13131 },
                "socketPort": 61816,
                "parent": ["70ecdf273ef360e4036390ff870c84db1115b8ffcb494597e9384e480afe5442"]
            },
            {
                "containerName": "testProject3",
                "image": "ubuntu",
                "tag": "latest",
                "containerId": "ab3b8c35a7eed628a03802787dd41b7558410f4195d00e912f291da0e6cd155b",
                "status": "running",
                "bridgeInfo": { "testBridge": "testAlias" },
                "containers": ["testProject"],
                "portInfo": { "1234": 4321 },
                "socketPort": 61329,
                "ramUsage": "0.00%",
                "parent": ["8c3f514d9dbd2216991d6b60c18bcbf524bd721c5a2d40140d72d39996db4f00"]
            }
        ],
        "port": [
            {
                "outBound": 1111,
                "inBound": [2222, 2222],
                "onContainer": "f8f244355925bf9b43beeb2ec93a6b4d96f7e1752e04b448372573a92346ddef",
                "connectedContainers": ["1dd43d7d93d5acf7a7747a2cd946b01b66dadb9af263d0f001ffba36ee2ca8df"]
            },
            { "outBound": 3333, "inBound": [4444], "onContainer": "f8f244355925bf9b43beeb2ec93a6b4d96f7e1752e04b448372573a92346ddef", "connectedContainers": [] },
            { "outBound": 1313, "inBound": [1414], "onContainer": "815e7d0b51a44897476e99edc5348a45c657dd9115c9d83220960cd943c1d813", "connectedContainers": [] },
            { "outBound": 12345, "inBound": [54321], "onContainer": "fbe9ed75526f1e62e8404f2a594287ab59865ec289990061a185e74e54d35973", "connectedContainers": [] },
            { "outBound": 22222, "inBound": [33333], "onContainer": "fbe9ed75526f1e62e8404f2a594287ab59865ec289990061a185e74e54d35973", "connectedContainers": [] },
            { "outBound": 12222, "inBound": [12222], "onContainer": "282d89de768d5772238b333dc5eb8f12d86adaa1b42c5de64c8b17d04708f7c4", "connectedContainers": [] },
            { "outBound": 13131, "inBound": [13131], "onContainer": "282d89de768d5772238b333dc5eb8f12d86adaa1b42c5de64c8b17d04708f7c4", "connectedContainers": [] },
            { "outBound": 1234, "inBound": [4321], "onContainer": "ab3b8c35a7eed628a03802787dd41b7558410f4195d00e912f291da0e6cd155b", "connectedContainers": [] }
        ],
        "network": [
            { "name": "host", "networkId": "51451691d45e04223b4da5da2bfcf40557f1d78504b7f6881126809d91988651", "containers": [] },
            { "name": "none", "networkId": "2d07c58758e07d3c84fc8e2df4269bd00432745492163ead657effba81742b98", "containers": [] },
            {
                "name": "bridge",
                "networkId": "70ecdf273ef360e4036390ff870c84db1115b8ffcb494597e9384e480afe5442",
                "ip": "172.17.0.0/16",
                "containers": [
                    "815e7d0b51a44897476e99edc5348a45c657dd9115c9d83220960cd943c1d813",
                    "fbe9ed75526f1e62e8404f2a594287ab59865ec289990061a185e74e54d35973",
                    "282d89de768d5772238b333dc5eb8f12d86adaa1b42c5de64c8b17d04708f7c4"
                ]
            },
            {
                "name": "testBridge",
                "networkId": "8c3f514d9dbd2216991d6b60c18bcbf524bd721c5a2d40140d72d39996db4f00",
                "ip": "172.19.0.0/16",
                "containers": [
                    "f8f244355925bf9b43beeb2ec93a6b4d96f7e1752e04b448372573a92346ddef",
                    "1dd43d7d93d5acf7a7747a2cd946b01b66dadb9af263d0f001ffba36ee2ca8df",
                    "ab3b8c35a7eed628a03802787dd41b7558410f4195d00e912f291da0e6cd155b"
                ]
            }
        ]
    } // 추후 fetch 로 변경

    const imageType = (type: string, imageType?: string) => {
        if (imageType === undefined) {
            return type === "port" ? "/images/port.svg" : "/images/network.svg"
        } else {
            let dataType: { [key: string]: string } = {
                ubuntu: "/images/serverImage/ubuntu.png",
                centos: "/images/serverImage/centos.png",
            }
            let result = dataType[imageType];
            return result === undefined ? "/images/serverImage/computer.svg" : result
        }
    }

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
            id: "outBound"
        },
        network: {
            padding: 200,
            r: 50,
            y: 0,
            name: "name",
            id: "networkId"
        }
    }

    let zoom = d3.zoom().scaleExtent([0.25, 10])
        .on('zoom', handleZoom)

    const getWidthSize = () => {
        let contentWidth = 0;
        let dataType = "";
        for (let type in dockerData) {
            let tmpWidth = 0;
            if (dockerData[type].length < 2) {
                tmpWidth = dockerData[type].length * (dataConvertor[type].r * 2)
            } else {
                tmpWidth = (dockerData[type].length - 1) * dataConvertor[type].padding + dataConvertor[type].r * 2
            }
            if (contentWidth < tmpWidth) {
                contentWidth = tmpWidth
                dataType = type;
            }
        }
        return { width: contentWidth, type: dataType };
    }

    const drawContainer = () => {
        let container = d3.select("#containerView").select("g")

        container.append("defs").append("marker")
            .attr('id', 'arrow')
            .attr('viewBox', '[0, 0, 10, 10]')
            .attr('refX', 5)
            .attr('refY', 5)
            .attr('markerWidth', 10)
            .attr('markerHeight', 10)
            .attr('orient', 'auto-start-reverse')
            .append('path')
            .attr('d', d3.line()([[0, 0], [0, 10], [10, 5]]))
            .attr('stroke', '#fff')
            .attr("fill", "#fff");

        container.selectAll("g").remove();

        let widthResult = getWidthSize();

        for (let type in dockerData) {
            let tmpNum = 0;
            for (let node of dockerData[type]) {
                let conCircle = container.append("g")
                    .attr("id", node[dataConvertor[type].id])
                    .datum(node)
                    .on("mouseover", (e, d) => {
                        container.selectAll("g").attr("opacity", 0.3)
                        container.selectAll("line").attr("opacity", 0.3)
                        d3.select(`[id="${d[dataConvertor[type].id]}"]`).attr("opacity", 1)
                        for (let port in d.portInfo) {
                            d3.select(`[id="${port}"]`).attr("opacity", 1)
                        }
                        for (let bridge in d.bridgeInfo) {
                            const realName = dockerData.network.find((v: any) => v.name === bridge)
                            if (realName !== undefined) {
                                d3.select(`[id="${realName.networkId}"]`).attr("opacity", 1)
                            }
                        }
                        d3.selectAll("line").filter((tmp: any, i: any) => {
                            if (tmp.source === d[dataConvertor[type].id] || tmp.target === d[dataConvertor[type].id]) {
                                return true;
                            }
                        }).attr("opacity", 1)
                    })
                    .on("mouseout", () => {
                        container.selectAll("g").attr("opacity", 1)
                        container.selectAll("line").attr("opacity", 1)
                    })
                let x = type !== widthResult.type ? widthResult.width / (dockerData[type].length + 1) * (tmpNum + 1) - dataConvertor[type].r : tmpNum * dataConvertor[type].padding;
                let r = dataConvertor[type].r
                let y = dataConvertor[type].y
                if (type === "container") {
                    y = tmpNum % 2 === 0 ? y + r : y - r
                }
                conCircle.append("svg:image")
                    .attr("width", r)
                    .attr("height", r)
                    .attr("xlink:href", imageType(type, node.image !== undefined ? node.image : undefined))
                    .attr("x", x - r / 2)
                    .attr("y", () => {
                        return y - r / 2
                    })
                conCircle.append("circle")
                    .attr("r", r)
                    .attr("fill", "none")
                    .attr("stroke", "#fff")
                    .attr("stroke-width", "3")
                    .attr("cx", x)
                    .attr("cy", () => {
                        return y
                    })
                conCircle
                    .append("text").text(node[dataConvertor[type].name])
                    .style("text-anchor", "middle")
                    .style("fill", "#fff")
                    .attr("x", x)
                    .attr("y", y + r + 20)
                tmpNum++
            }
        }
    }

    const drawLine = () => {
        let container = d3.select("#containerView").select("g")
        let makeLine: any = [];
        for (let node of dockerData.container) {
            for (let port in node.portInfo) {
                let startPoint = d3.select(`[id="${port}"]`).node()
                let endPoint = d3.select(`[id="${node.containerId}"]`).node()
                if (startPoint !== null && endPoint !== null) {
                    d3
                        .select("#containerView")
                        .select("g")
                        .append("line")
                        .datum({
                            source: port,
                            target: node.containerId
                        })
                        .attr("id", `${port}:${node.containerId}`)
                        .style("stroke", "#fff")
                        .style("stroke-width", 1)
                        .attr("x1", startPoint.getBoundingClientRect().x - 170)
                        .attr("y1", startPoint.getBoundingClientRect().y - 120)
                        .attr("x2", endPoint.getBoundingClientRect().x - 170)
                        .style("stroke-dasharray", ("10, 4"))
                        .attr("y2", endPoint.getBoundingClientRect().y + 40)
                        .attr("marker-end", "url(#arrow)").attr("marker-start", "url(#arrow)");
                }
            }
            for (let bridge in node.bridgeInfo) {
                const realName = dockerData.network.find((v: any) => v.name === bridge)
                if (realName !== undefined) {
                    let startPoint = d3.select(`[id="${realName.networkId}"]`).node()
                    let endPoint = d3.select(`[id="${node.containerId}"]`).node()
                    if (startPoint !== null && endPoint !== null) {
                        d3
                            .select("#containerView")
                            .select("g")
                            .append("line")
                            .datum({
                                source: realName.networkId,
                                target: node.containerId
                            })
                            .attr("id", `${realName.networkId}:${node.containerId}`)
                            .style("stroke", "#fff")
                            .style("stroke-dasharray", ("10, 4"))
                            .style("stroke-width", 1)
                            .attr("x1", startPoint.getBoundingClientRect().x - 175)
                            .attr("y1", startPoint.getBoundingClientRect().y + 20)
                            .attr("x2", endPoint.getBoundingClientRect().x - 160)
                            .attr("y2", endPoint.getBoundingClientRect().y - 120)
                            .attr("marker-end", "url(#arrow)")
                            .attr("marker-start", "url(#arrow)");
                    }
                }
            }
            for (let connectNode of node.containers) {
                let tmpNode = dockerData.container.find((v: any) => v.containerName === connectNode);
                let checkIs = false;
                if (makeLine.length !== 0) {
                    for (let i of makeLine) {
                        if (i.target === tmpNode.containerId && i.source === node.containerId) {
                            checkIs = true
                        }
                    }
                }
                if (node !== null && !checkIs) {
                    let startPoint = d3.select(`[id="${tmpNode.containerId}"]`).node()
                    let endPoint = d3.select(`[id="${node.containerId}"]`).node()
                    if (startPoint !== null && endPoint !== null) {
                        makeLine.push({ source: tmpNode.containerId, target: node.containerId })
                        let lineGenrator = d3.line().curve(d3.curveNatural)
                        const points = [[startPoint.getBoundingClientRect().x - 175, startPoint.getBoundingClientRect().y], [endPoint.getBoundingClientRect().x - 200, endPoint.getBoundingClientRect().y],];
                        let pathData = lineGenrator(points)
                        d3.select("#containerView")
                            .select("g")
                            .append("line")
                            .datum({ source: tmpNode.containerId, target: node.containerId })
                            .attr("fill", "none")
                            .attr("id", `${tmpNode.containerId}:${node.containerId}`)
                            .style("stroke", "#fff")
                            .style("stroke-dasharray", ("10, 4"))
                            .style("stroke-width", 1)
                            .attr("x1", startPoint.getBoundingClientRect().x - 225)
                            .attr("y1", startPoint.getBoundingClientRect().y - 40)
                            .attr("x2", endPoint.getBoundingClientRect().x - 100)
                            .attr("y2", endPoint.getBoundingClientRect().y - 65)
                            .attr("marker-end", "url(#arrow)")
                            .attr("marker-start", "url(#arrow)");
                    }
                }
            }
        }

        animate();

        function animate() {
            container.selectAll("line")
                .transition()
                .duration(1000)
                .ease(d3.easeLinear)
                .styleTween("stroke-dashoffset", () => {
                    return d3.interpolate(0, 14);
                })
                .on("end", animate);

        }
    }

    const zoomAppend = () => {
        d3.select("#containerView").transition().call((zoom as any).scaleBy, 1.5)
    }

    const zoomDecr = () => {
        d3.select("#containerView").transition().call((zoom as any).scaleBy, 2 / 3);
    }

    const initCenter = () => {
        let test = d3.select("#containerView").select("g");
    }

    const toCenter = () => {
        let node: any = d3.select("#containerView").node()
        let g: any = d3.select("#containerView").select("g").node()
        if (node !== null && g !== null) {
            let content = g.getBoundingClientRect();
            let width = node.getBoundingClientRect().width;
            let height = node.getBoundingClientRect().height;

            d3.select("#containerView")
                .transition()
                .call((zoom as any).translateTo, 0.5 * width + content.width / 2, 0.5 * height + content.height / 2);
        }
    }

    return <div className={classes.root}>
        <div className={classes.content}>
            <svg id="containerView" style={{ width: "100%", height: "100%" }} >
                <g />
            </svg>
            <div className={classes.buttonWrapper}>
                <div className={classes.buttonContent}>
                    <IconButton className={classes.buttonHolder}
                        onClick={() => {
                            setZoomLock(!zoomLock)
                        }}>
                        {!zoomLock ?
                            <LockOutlinedIcon className={classes.button} /> :
                            <LockOpenOutlinedIcon className={classes.button} />}
                    </IconButton>
                    <div className={classes.divideLine} />
                    <IconButton className={classes.buttonHolder}
                        onClick={() => {
                            if (!zoomLock) {
                                zoomAppend()
                            }
                        }}>
                        <AddOutlinedIcon className={classes.button} />
                    </IconButton>
                    <div className={classes.divideLine} />
                    <IconButton className={classes.buttonHolder}
                        onClick={() => {
                            if (!zoomLock) {
                                zoomDecr()
                            }
                        }}>
                        <RemoveOutlinedIcon className={classes.button} />
                    </IconButton>
                    <div className={classes.divideLine} />
                    <IconButton className={classes.buttonHolder}
                        onClick={() => {
                            if (!zoomLock) {
                                toCenter()
                            }
                        }}>
                        <FullscreenOutlinedIcon className={classes.button} />
                    </IconButton>
                </div>
            </div>
        </div>
    </div>
}