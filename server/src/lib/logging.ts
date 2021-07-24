import express from "express";
import log from "../module/log";

const router = express.Router();

const logFilter = ["_next", "favicon.ico"];

router.all("*", (req, res, next) => {
    const requestTime = new Date().getTime();
    const url = req.originalUrl.split("?")[0];

    if (logFilter.indexOf(url.split("/")[1]) === -1) {
        res.on("finish", () => {
            const message = `${req.method} ${url} +${
                new Date().getTime() - requestTime
            }ms`;

            if (res.statusCode < 400) {
                log.verbose(message);
            } else {
                log.error(message);
            }
        });
    }

    next();
});

export default router;
