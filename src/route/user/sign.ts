import express from "express";
import { ResponseCode } from "../../constants/response";
import tokenRouter from "../../lib/router/token";
import DataUserManager from "../../module/data/service/user/userManager";
import { signToken } from "../../module/token";

const router = express.Router();

router.post("/", (req, res) => {
    const userId = req.body?.userId;
    const passwd = req.body?.passwd;

    if (userId === undefined || passwd === undefined) {
        return res.json({ code: ResponseCode.missingParameter });
    }

    const userData = DataUserManager.get(userId);

    if (userData === undefined) {
        return res.json({ code: ResponseCode.invaildRequest });
    } else if (userData.passwd !== passwd) {
        return res.json({ code: ResponseCode.invaildPasswd });
    }

    // set token Cookies
    const token = signToken({ userId, userName: userData.userName })
    res.cookie('authorization', token, { httpOnly: true, maxAge: 10 * 60 * 1000})

    res.json({ code: ResponseCode.ok })
});

router.delete("/", tokenRouter, (_, res) => {
    res.clearCookie('Authorization')
    res.json({ code: ResponseCode.ok })
});

export default router;
