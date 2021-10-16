import express from "express";
import { ResponseCode } from "../../constants/response";
import tokenRouter from "../../lib/router/token";
import DataUserManager from "../../module/data/user/userManager";
import log from "../../module/log";

const router = express.Router();

router.get("/", tokenRouter, (req, res) => {
    const userId = req.token.userId!;
    const userData = DataUserManager.get(userId);

    if (userData === undefined) {
        return res.json({ code: ResponseCode.invaildRequest });
    }

    return res.json({ code: ResponseCode.ok, user: { ...userData, passwd: undefined } });
});

router.post("/", (req, res) => {
    const userId = req.body?.userId;
    const passwd = req.body?.passwd;
    const userName = req.body?.userName;
    const userThumbnail = req.body?.userThumbnail;

    if (userId === undefined || passwd === undefined || userName === undefined) {
        return res.json({ code: ResponseCode.missingParameter });
    }
    if (typeof userId !== "string" || typeof passwd !== "string" || typeof userName !== "string") {
        return res.json({ code: ResponseCode.invaildParameterType });
    }

    if (!DataUserManager.create({ userId, userName, passwd, userThumbnail })) {
        return res.json({ code: ResponseCode.internalError });
    }

    log.info(`Create user account (userId: "${userId}")`);

    return res.json({ code: ResponseCode.created });
});

router.put("/", tokenRouter, (req, res) => {
    const userId = req.token.userId!;
    const passwd = req.body?.passwd;
    const userName = req.body?.userName;
    const userThumbnail = req.body?.userThumbnail;

    if (!DataUserManager.update({ userId, passwd, userName, userThumbnail })) {
        return res.json({ code: ResponseCode.invaildParameterType });
    }

    log.info(`Update user account (userId: "${userId}")`);

    return res.json({ code: ResponseCode.ok });
});

router.delete("/", tokenRouter, (req, res) => {
    const userId = req.token.userId!;

    DataUserManager.delete(userId);
    log.info(`Delete user account (userId: "${userId}")`);

    res.clearCookie("authorization");
    return res.json({ code: ResponseCode.ok });
});

export default router;
