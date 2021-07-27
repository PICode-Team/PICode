import express from "express";
import { getThumbnailfromUUID } from "../../module/data/fileManager";
import DataUploadManager from "../../module/data/uploadManager";

const router = express.Router();

router.get("/", (req, res) => {
    const userId = req.session.userId as string;
    const thumbnail = req.query?.uuid as string;
    //const type: "user" | "project" = "project";
    if (thumbnail !== "undefined") {
        DataUploadManager.loadUploadFileInfo();
        const thumbnailPath = getThumbnailfromUUID(userId, thumbnail);
        res.set("Content-Type", `${DataUploadManager.UploadFileManager[thumbnail].mimetype}`);
        res.sendFile(thumbnailPath);
    }
});

export default router;
