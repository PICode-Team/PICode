import express from "express";
import { ResponseCode } from "../../constants/response";
import tokenRouter from "../../lib/router/token";
import DataUserManager from "../../module/data/user/userManager";

const router = express.Router();

router.get("/", tokenRouter, (req, res) => {
    const userId = req.token.userId!;
    const queryUser = req.query?.userId as string | undefined;
    return res.json({ code: ResponseCode.ok, user: [...DataUserManager.getList(userId, queryUser)] });
});
export default router;
