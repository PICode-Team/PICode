import multer from "multer";
import { UploadDirectoryPath } from "../../types/module/data/data.types";
import { v4 as uuidv4 } from "uuid";
import DataUploadManager from "../../module/data/etc/uploadManager";
import fs from "fs";

const upload = multer({
    storage: multer.diskStorage({
        destination: function (_req, _res, cb) {
            if (!fs.existsSync(UploadDirectoryPath)) {
                fs.mkdirSync(UploadDirectoryPath, { recursive: true });
            }
            cb(null, `${UploadDirectoryPath}`);
        },
        filename: function (req, file, cb) {
            const fileId = uuidv4();
            req.fileId = fileId;
            DataUploadManager.loadUploadFileInfo();
            DataUploadManager.saveUploadFileInfo(fileId, file);
            cb(null, fileId);
        },
    }),
});

export default upload;
