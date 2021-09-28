import express from "express";
import { ResponseCode } from "../../../constants/response";
import tokenRouter from "../../../lib/router/token";
import DataDockerManager from "../../../module/data/service/workspace/dockerManager";
import log from "../../../module/log";

const router = express.Router();

router.get("/", tokenRouter, (_, res) => {
    const dockerVisualInfo = DataDockerManager.getDockerVisualizationInfo();
    log.debug(`dockerVisualInfo: ${JSON.stringify(dockerVisualInfo)}`);
    return res.json({ code: ResponseCode.ok, dockerVisualInfo: dockerVisualInfo });
});

router.put("/", tokenRouter, (req, res) => {
    const userId = req.token.userId!;
    const containerId = req.body?.containerId;
    const dockerInfo = req.body?.dockerInfo;

    if (containerId === undefined || dockerInfo === undefined) {
        return res.json({ code: ResponseCode.missingParameter });
    }

    if (!DataDockerManager.updateFromDocker(userId, containerId, dockerInfo)) {
        return res.json({ code: ResponseCode.internalError });
    }

    return res.json({ code: ResponseCode.ok });
});

export default router;
