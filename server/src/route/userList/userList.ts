import express from "express";
import { ResponseCode } from "../../constants/response";
import sessionRouter from "../../lib/router/session";
import DataUserManager from "../../module/data/userManager";

const router = express.Router();

router.get("/", sessionRouter, (req, res) => {
    const queryUser = req.query?.userId as string | undefined;
    return res.json({ code: ResponseCode.ok, user: [...DataUserManager.getList(queryUser)] });
});
export default router;
