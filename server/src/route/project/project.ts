import express from "express";
import { ResponseCode } from "../../constants/response";
import sessionRouter from "../../lib/router/session";
import DataProjectManager from "../../module/data/projectManager";
import log from "../../module/log";
import { TProjectUpdateData } from "../../types/module/data/project.type";

const router = express.Router();

router.get("/", sessionRouter, (req, res) => {
    const userId = req.session.userId as string;
    const projectName = req.query?.projectName as string;

    const projectDataList = DataProjectManager.get(userId, projectName);
    return res.json({ code: ResponseCode.ok, projectList: projectDataList });
});

router.post("/", sessionRouter, (req, res) => {
    const userId = req.session.userId as string;
    const projectInfo = req.body?.projectInfo;
    const dockerInfo = req.body?.dockerInfo;
    const source = req.body?.source ?? {};

    if (!DataProjectManager.create(userId, projectInfo, dockerInfo, source)) {
        return res.json({ code: ResponseCode.confilct });
    }

    log.info(`Create project (projectName: "${projectInfo.projectName}")`);

    return res.json({ code: ResponseCode.ok });
});

router.put("/", sessionRouter, (req, res) => {
    const userId = req.session.userId as string;
    const projectName = req.body?.projectName as string;
    const projectInfo = req.body?.projectInfo as TProjectUpdateData;
    const dockerInfo = req.body?.dockerInfo;
    if (projectName === undefined) {
        return res.json({ code: ResponseCode.missingParameter });
    }

    if (!DataProjectManager.update(userId, projectName, false, projectInfo, dockerInfo)) {
        return res.json({ code: ResponseCode.invaildRequest });
    }

    log.info(`ProjectInfo changed (Projectname: "${projectInfo.projectName}", projectDescription : "${projectInfo.projectDescription}", projectThumbnail : "${projectInfo.projectThumbnail}")`);

    return res.json({ code: ResponseCode.ok });
});

router.delete("/", sessionRouter, (req, res) => {
    const userId = req.session.userId as string;
    const projectName = req.query?.projectName as string;

    if (projectName === undefined) {
        return res.json({ code: ResponseCode.missingParameter });
    }

    if (!DataProjectManager.delete(userId, projectName)) {
        return res.json({ code: ResponseCode.invaildRequest });
    }
    log.info(`Delete user project (projectName: "${projectName}")`);
    return res.json({ code: ResponseCode.ok });
});

export default router;
