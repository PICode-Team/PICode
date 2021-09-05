import express from "express";
import { ResponseCode } from "../../../constants/response";
import sessionRouter from "../../../lib/router/session";
import DataDockerManager from "../../../module/data/dockerManager";

const router = express.Router();

router.get("/", sessionRouter, (_, res) => {
    const dockerVisualInfo = DataDockerManager.getDockerVisualizationInfo();
    return res.json({ code: ResponseCode.ok, dockerVisualInfo: dockerVisualInfo });
});

export default router;
