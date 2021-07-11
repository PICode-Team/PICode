import express from "express";
import { ResponseCode } from "../../constants/response";
import log from "../../module/log";

const router = express.Router();

router.post("/", (req, res) => {
    const userId = req.session.userId as string;
    log.info(`${userId} reached route /data`);
    return res.json({ code: ResponseCode.ok });
});

export default router;
