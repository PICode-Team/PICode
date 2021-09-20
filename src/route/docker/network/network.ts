import express from "express";
import { ResponseCode } from "../../../constants/response";
import sessionRouter from "../../../lib/router/session";
import DataDockerManager from "../../../module/data/service/workspace/dockerManager";
import log from "../../../module/log";
const router = express.Router();

router.get("/", sessionRouter, (req, res) => {
    const networkId = req.query?.networkId as string;
    const dockerNetworkList = DataDockerManager.getNetworkById(networkId);
    return res.json({ code: ResponseCode.ok, networkList: dockerNetworkList });
});

router.post("/", (req, res) => {
    const networkName = req.body?.networkName;
    const subnet = req.body?.subnet;
    const ipRange = req.body?.ipRange;
    const gateway = req.body?.gateway;
    if (networkName === undefined) {
        return res.json({ code: ResponseCode.missingParameter });
    }

    const result = DataDockerManager.createNetwork({ name: networkName, subnet, ipRange, gateway });
    if (result.code === ResponseCode.ok) {
        log.info(`Docker network created ${networkName}`);
    }
    return res.json(result);
});

router.delete("/", (req, res) => {
    const networkId = req.query?.networkId as string;
    if (networkId === undefined) {
        return res.json({ code: ResponseCode.missingParameter });
    }

    const result = DataDockerManager.deleteNetwork(networkId);
    if (result.code === ResponseCode.ok) {
        log.info(`Docker network deleted ${networkId}`);
    }
    return res.json(result);
});

export default router;
