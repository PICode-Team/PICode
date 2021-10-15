import express from "express";
import { ResponseCode } from "../../../constants/response";
import tokenRouter from "../../../lib/router/token";
import DataWorkspaceManager from "../../../module/data/service/workspace/workspaceManager";

const router = express.Router();

router.post("/", tokenRouter, (req, res) => {
    const userId = req.token.userId!;
    const option = req.body?.option;
    if (option === undefined) {
        return res.json({ code: ResponseCode.missingParameter, meesage: "Please enter export option" });
    }
    const result = DataWorkspaceManager.export(userId, option);
    return res.json(result);
});

export default router;
