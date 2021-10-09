import express from "express";
import tokenRouter from "../../lib/router/token";
import og from "open-graph";
import { ResponseCode } from "../../constants/response";

const router = express.Router();

router.post("/", tokenRouter, (req, res) => {
    const url = req.body?.url;
    og(url, (err, data) => {
        if (err) {
            return res.json({ code: ResponseCode.internalError, error: "Error occured while getting open graph" });
        }
        return res.json({ code: ResponseCode.ok, metaData: data });
    });
});

export default router;
