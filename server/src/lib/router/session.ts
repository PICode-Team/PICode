import express from "express";
import { ResponseCode } from "../../constants/response";

const router = express.Router();

router.all("*", (req, res, next) => {
    console.log(req.session);
    
    if (req.session.userId === undefined) {
        res.json({ code: ResponseCode.notFoundSession });
    }

    next();
});

export default router;
