import express from "express";
import { ResponseCode } from "../../constants/response";
import sessionRouter from "../../lib/router/session";
import DataUserManager from "../../module/data/service/user/userManager";

const router = express.Router();

router.get("/", sessionRouter, (req, res) => {
    const userId = req.session.userId as string;
    const queryUser = req.query?.userId as string | undefined;
    return res.json({ code: ResponseCode.ok, user: [...DataUserManager.getList(userId, queryUser)] });
});
export default router;
