import express from "express";
import { ResponseCode } from "../../constants/response";
import upload from "../../lib/router/upload";

const router = express.Router();

router.post("/", upload.single("uploadFile"), (req, res) => {
    const uploadFile = req.file;

    if (uploadFile === undefined) {
        return res.json({ code: ResponseCode.invaildRequest });
    }
    return req.fileId === undefined
        ? res.json({ code: ResponseCode.internalError })
        : res.json({
              code: ResponseCode.ok,
              uploadFileId: req.fileId,
          });
});

export default router;
