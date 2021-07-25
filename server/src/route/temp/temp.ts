import express from "express";
import { getThumbnailfromUUID, UploadFileManager } from "../../module/data/fileManager";

const router = express.Router();

router.get("/", (req, res) => {
    const userId = req.session.userId as string;
    const projectThumbnail = req.query?.uuid as string;

    const thumbnailPath = getThumbnailfromUUID(userId, projectThumbnail);
    res.set("Content-Type", `${UploadFileManager[projectThumbnail].mimetype}`);
    res.sendFile(thumbnailPath);
});

export default router;
