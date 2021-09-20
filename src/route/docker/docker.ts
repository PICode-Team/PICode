import express from "express";
import { ResponseCode } from "../../constants/response";
import sessionRouter from "../../lib/router/session";
import DataDockerManager from "../../module/data/service/workspace/dockerManager";
import log from "../../module/log";

const router = express.Router();

router.get("/", sessionRouter, (req, res) => {
    const workspaceId = req.query?.workspaceId as string;

    const dockerInfo = DataDockerManager.get(workspaceId);
    return res.json({ code: ResponseCode.ok, dockerInfo: dockerInfo });
});

router.post("/", (req, res) => {
    const userId = req.session.userId as string;
    const containerId = req.body?.containerId;
    const dockerCommand = req.body?.dockerCommand;
    if (containerId === undefined || dockerCommand === undefined) {
        res.json({ code: ResponseCode.missingParameter });
    }
    const result = DataDockerManager.manage(userId, containerId, dockerCommand);
    if (result.code === ResponseCode.ok) {
        log.info(`Docker ${dockerCommand} ${containerId}`);
    }
    res.json(result);
});

export default router;
