import express from "express";
import { ResponseCode } from "../../constants/response";
import sessionRouter from "../../lib/router/session";
import DataProjectManager from "../../module/data/projectManager";
import log from "../../module/log";

const router = express.Router();

router.get("/", sessionRouter, (req, res) => {
    const userId = req.session.userId as string;
    const projectName = req.query?.projectName as string;

    const projectDataList = DataProjectManager.get(userId, projectName);

    return res.json({ code: ResponseCode.ok, projectList: projectDataList });
});

router.post("/", (req, res) => {
    const userId = req.session.userId as string;
    const projectInfo = req.body?.projectInfo;
    const source = req.body?.source ?? {};

    DataProjectManager.create(userId, projectInfo, source);
    if (!true) {
        return res.json({ code: ResponseCode.internalError });
    }

    log.info(`Create project (projectName: "${projectInfo.projectName}")`);

    return res.json({ code: ResponseCode.ok });
});

router.put("/", (req, res) => {
    const userId = req.session.userId as string;
    const projectName = req.body?.projectName as string;
    const newProjectName = (req.body?.newProjectName as string) || projectName;
    const projectDescription = req.body?.projectDescription as string;
    const projectThumbnail = req.body?.projectThumbnail as string;
    const projectParticipants = req.body?.projectParticipants as string[];

    if (projectName === undefined) {
        return res.json({ code: ResponseCode.missingParameter });
    }

    const result = DataProjectManager.update(userId, projectName, {
        projectName: newProjectName,
        projectDescription,
        projectThumbnail,
        projectParticipants,
    });

    if (result === false) {
        return res.json({ code: ResponseCode.invaildRequest });
    }

    log.info(
        `ProjectInfo changed (Projectname: "${newProjectName}", projectDescription : "${projectDescription}", projectThumbnail : "${projectThumbnail}")`
    );

    return res.json({ code: ResponseCode.ok });
});

router.delete("/", (req, res) => {
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
