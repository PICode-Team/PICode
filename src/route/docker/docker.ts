import express from "express";
import { ResponseCode } from "../../constants/response";
import tokenRouter from "../../lib/router/token";
import DataDockerManager from "../../module/data/workspace/dockerManager";
import log from "../../module/log";

const router = express.Router();

router.get("/", tokenRouter, (req, res) => {
    const workspaceId = req.query?.workspaceId as string;

    const dockerList = DataDockerManager.get(workspaceId);
    return res.json({ code: ResponseCode.ok, dockerList });
});

router.post("/", tokenRouter, (req, res) => {
    const userId = req.token.userId!;
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
