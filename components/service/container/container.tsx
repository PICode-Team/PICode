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
        d3.select("#containerView").call(zoom as any)
        drawContainer();
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
            .attr('transform', e.transform);
    }

    const data = {
        "port": [
            { "outBound": 1111, "inBound": [1234], "onContainer": "add3addf547ad79e8c9bf1ffdbee4e7007ba27a5aa71b441c6e72d8d95293dea", "connectedContainers": [] },
            { "outBound": 60001, "inBound": [3306], "onContainer": "6eacebb44935eafadb5a18322e8781756022950c395936170d246374f9d4c60a", "connectedContainers": [] },
            { "outBound": 4321, "inBound": [1234], "onContainer": "8484772fd6bd6278e6d7c2507119320c0d49fa066f73bbdd8570f1eff03be905", "connectedContainers": [] }
        ],
        "network": [
            { "name": "host", "networkId": "51451691d45e04223b4da5da2bfcf40557f1d78504b7f6881126809d91988651", "containers": [] },
            { "name": "none", "networkId": "2d07c58758e07d3c84fc8e2df4269bd00432745492163ead657effba81742b98", "containers": [] },
            {
                "name": "bridge",
                "networkId": "5e1050d496fcab470d8d14bc6462a27bc8230b3c9b1e6c628243eebef54b35e2",
                "ip": "172.17.0.0/16",
                "containers": [
                    {
                        "containerName": "testProject2",
                        "image": "ubuntu",
                        "tag": "latest",
                        "containerId": "add3addf547ad79e8c9bf1ffdbee4e7007ba27a5aa71b441c6e72d8d95293dea",
                        "status": "running",
                        "bridgeInfo": { "bridge": "" },
                        "containers": [],
                        "hostPort": 1111,
                        "containerPort": 1234,
                        "ramUsage": "0.00%"
                    },
                    {
                        "containerName": "testProject3",
                        "image": "ubuntu",
                        "tag": "latest",
                        "containerId": "8484772fd6bd6278e6d7c2507119320c0d49fa066f73bbdd8570f1eff03be905",
                        "status": "running",
                        "bridgeInfo": { "bridge": "" },
                        "containers": [],
                        "hostPort": 4321,
                        "containerPort": 1234,
                        "ramUsage": "0.00%"
                    }
                ]
            },
            {
                "name": "testBridge",
                "networkId": "8c3f514d9dbd2216991d6b60c18bcbf524bd721c5a2d40140d72d39996db4f00",
                "ip": "172.19.0.0/16",
                "containers": [
                    {
                        "containerName": "testProject",
                        "image": "ubuntu",
                        "tag": "latest",
                        "containerId": "e9e41fcfb7516a88ad1e72eabb82999178ca048ec7a4781e860e32c33a63c0cc",
                        "status": "running",
                        "bridgeInfo": { "testBridge": "" },
                        "containers": ["testProject4"],
                        "ramUsage": "0.02%"
                    },
                    {
                        "containerName": "testProject3",
                        "image": "ubuntu",
                        "tag": "latest",
                        "containerId": "8484772fd6bd6278e6d7c2507119320c0d49fa066f73bbdd8570f1eff03be905",
                        "status": "running",
                        "bridgeInfo": { "bridge": "" },
                        "containers": [],
                        "hostPort": 4321,
                        "containerPort": 1234,
                        "ramUsage": "0.00%"
                    },
                    {
                        "containerName": "testProject4",
                        "image": "ubuntu",
                        "tag": "latest",
                        "containerId": "8b208331df2b08d41b74e3f1a5dfd0907adfa3c89f5938d45a3e022675ecb633",
                        "status": "running",
                        "bridgeInfo": { "testBridge": "testAlias" },
                        "containers": ["testProject"],
                        "ramUsage": "0.00%"
                    },
                    {
                        "containerName": "testProject5",
                        "image": "ubuntu",
                        "tag": "latest",
                        "containerId": "6eacebb44935eafadb5a18322e8781756022950c395936170d246374f9d4c60a",
                        "status": "running",
                        "bridgeInfo": { "testBridge": "testAlias" },
                        "containers": ["testProject"],
                        "hostPort": 60001,
                        "containerPort": 3306,
                        "ramUsage": "0.00%"
                    }
                ]
            }
        ]
    }

    let zoom = d3.zoom().scaleExtent([0.25, 10])
        .on('zoom', handleZoom);

    const dataConvertor = () => {
        let container: any = [];
        for (let i of data.network) {
            if (i.containers.length !== 0) {
                for (let j of i.containers) {
                    if (container.length === 0) {
                        let tmpNode: any = j;
                        tmpNode.parent = [];
                        tmpNode.parent.push(i.networkId)
                        container.push(tmpNode)
                    } else {
                        let node = container.findIndex((v: any) => v.containerId === j.containerId)
                        if (node !== -1) {
                            if (container[node].parent === undefined) {
                                container[node].parent = [];
                                container[node].parent.push(i.networkId)
                            } else {
                                container[node].parent.push(i.networkId)
                            }

                        } else {
                            let tmpNode: any = j;
                            tmpNode.parent = [];
                            tmpNode.parent.push(i.networkId)
                            container.push(tmpNode)
                        }

                    }
                }
            }
        }
        return container;
    }


    const drawContainer = () => {
        let container = d3.select("#containerView").select("g")

        container.selectAll("g").remove();

        let noContainer = [];
        let noPort = [];
        let dockerData = dataConvertor();
        let tmpNum = 0;
        let containerWidth = 0;
        for (let i of dockerData) {
            let conCircle = container.append("g")
            conCircle.append("circle")
                .attr("r", 40)
                .attr("cx", tmpNum * 200)
                .attr("stroke", "#fff")
                .attr("fill", "none")
                .attr("stroke-width", "2")
                .attr("cy", 500 + (data.network.length - i.parent.length) * 160)
                .attr("id", `${i.containerId}`)
            tmpNum++;
            containerWidth = tmpNum * 160;
        }
        tmpNum = 0;
        for (let i of data.network) {
            let conCircle = container.append("g")
            conCircle.append("circle")
                .attr("r", 50)
                .attr("fill", "none")
                .attr("stroke", "#fff")
                .attr("stroke-width", "3")
                .attr("cx", containerWidth / (data.network.length) * tmpNum + (containerWidth / (2 * (data.network.length))))
                .attr("cy", 450)
            tmpNum++
        }
        tmpNum = 0;
        for (let i of data.port) {
            let conCircle = container.append("g")
            conCircle.append("circle")
                .attr("r", 60)
                .attr("stroke", "#fff")
                .attr("fill", "none")
                .attr("stroke-width", "4")
                .attr("cx", containerWidth / (data.port.length) * tmpNum + (containerWidth / (2 * (data.port.length))))
                .attr("cy", 50)
            tmpNum++
        }

        let toCenter = d3.select("#containerView").node();

    }

    const zoomAppend = () => {
        d3.select("#containerView").transition().call((zoom as any).scaleBy, 1.5);
    }
    const zoomDecr = () => {
        d3.select("#containerView").transition().call((zoom as any).scaleBy, 2 / 3);
    }

    const toCenter = () => {
        let node: any = d3.select("#containerView").node()

        if (node !== null) {
            let width = node.getBoundingClientRect().width;
            let height = node.getBoundingClientRect().height;
            d3.select("#containerView")
                .transition()
                .call((zoom as any).translateTo, 0.5 * width, 0.5 * height);
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