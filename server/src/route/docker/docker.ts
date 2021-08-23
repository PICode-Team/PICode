import express from "express";
import { ResponseCode } from "../../constants/response";
import sessionRouter from "../../lib/router/session";
import DataDockerManager from "../../module/data/dockerManager";

const router = express.Router();

router.get("/", sessionRouter, (req, res) => {
    const userId = req.session.userId as string;
    const projectName = req.body?.projectName;

    if (projectName === undefined) {
        return res.json({ code: ResponseCode.missingParameter });
    }

    const dockerInfo = DataDockerManager.get(userId, projectName);
    return res.json(dockerInfo !== undefined ? { code: ResponseCode.ok, dockerInfo: dockerInfo } : { code: ResponseCode.internalError });
});

router.post("/", (req, res) => {
    const userId = req.session.userId as string;
    const projectName = req.body?.projectName;
    const dockerCommand = req.body?.dockerCommand;
    if (projectName === undefined || dockerCommand === undefined) {
        res.json({ code: ResponseCode.missingParameter });
    }
    DataDockerManager.manage(userId, projectName, dockerCommand);
    res.json({ code: ResponseCode.ok });
});

export default router;
