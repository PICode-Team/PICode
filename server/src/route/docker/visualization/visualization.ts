import express from "express";
import { ResponseCode } from "../../../constants/response";
import sessionRouter from "../../../lib/router/session";
import DataDockerManager from "../../../module/data/dockerManager";
import log from "../../../module/log";

const router = express.Router();

router.get("/", sessionRouter, (_, res) => {
    const dockerVisualInfo = DataDockerManager.getDockerVisualizationInfo();
    log.debug(`dockerVisualInfo: ${JSON.stringify(dockerVisualInfo)}`);
    return res.json({ code: ResponseCode.ok, dockerVisualInfo: dockerVisualInfo });
});

router.put("/", sessionRouter, (req, res) => {
    const userId = req.session.userId as string;
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
