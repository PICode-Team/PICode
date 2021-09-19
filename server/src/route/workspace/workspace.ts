import express from "express";
import { ResponseCode } from "../../constants/response";
import sessionRouter from "../../lib/router/session";
import DataWorkspaceManager from "../../module/data/workspaceManager";
import log from "../../module/log";
import { TWorkspaceUpdateData } from "../../types/module/data/workspace.type";

const router = express.Router();

router.get("/", sessionRouter, (req, res) => {
    const userId = req.session.userId as string;
    const workspaceId = req.query?.workspaceId as string;

    const workspaceList = DataWorkspaceManager.get(userId, workspaceId);
    return res.json({ code: ResponseCode.ok, workspaceList: workspaceList });
});

router.post("/", sessionRouter, (req, res) => {
    const userId = req.session.userId as string;
    const workspaceInfo = req.body?.workspaceInfo;
    const dockerInfo = req.body?.dockerInfo;
    const source = req.body?.source ?? {};

    const result = DataWorkspaceManager.create(userId, workspaceInfo, dockerInfo, source);
    if (result.code === ResponseCode.ok) {
        log.info(`Create workspace (workspaceName: "${workspaceInfo.name}")`);
    }

    return res.json(result);
});

router.put("/", sessionRouter, (req, res) => {
    const userId = req.session.userId as string;
    const workspaceId = req.body?.workspaceId as string;
    const workspaceInfo = req.body?.workspaceInfo as TWorkspaceUpdateData;
    const dockerInfo = req.body?.dockerInfo;
    if (workspaceId === undefined) {
        return res.json({ code: ResponseCode.missingParameter });
    }

    const result = DataWorkspaceManager.update(userId, workspaceId, false, workspaceInfo, dockerInfo);
    if (result.code === ResponseCode.ok) {
        log.info(`workspaceInfo changed (workspaceName: "${workspaceInfo.name}", workspaceDescription : "${workspaceInfo.description}", workspaceThumbnail : "${workspaceInfo.thumbnail}")`);
    }

    return res.json(result);
});

router.delete("/", sessionRouter, (req, res) => {
    const userId = req.session.userId as string;
    const workspaceId = req.query?.workspaceId as string;

    if (workspaceId === undefined) {
        return res.json({ code: ResponseCode.missingParameter });
    }

    const result = DataWorkspaceManager.delete(userId, workspaceId);
    if (result.code === ResponseCode.ok) {
        log.info(`Delete user workspace (workspaceId: "${workspaceId}")`);
    }

    return res.json(result);
});

export default router;
