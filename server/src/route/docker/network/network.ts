import express from "express";
import { ResponseCode } from "../../../constants/response";
import sessionRouter from "../../../lib/router/session";
import DataDockerManager from "../../../module/data/dockerManager";
import log from "../../../module/log";
const router = express.Router();

router.get("/", sessionRouter, (req, res) => {
    const networkName = req.query?.networkName as string;
    const dockerNetworkList = DataDockerManager.getNetwork(networkName);
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

    if (!DataDockerManager.createNetwork({ networkName, subnet, ipRange, gateway })) {
        return res.json({ code: ResponseCode.confilct });
    }
    log.info(`Docker network created ${networkName}`);
    return res.json({ code: ResponseCode.ok });
});

router.delete("/", (req, res) => {
    const networkName = req.query?.networkName as string;
    if (networkName === undefined) {
        return res.json({ code: ResponseCode.missingParameter });
    }
    DataDockerManager.deleteNetwork(networkName);
    return res.json({ code: ResponseCode.ok });
});

export default router;
