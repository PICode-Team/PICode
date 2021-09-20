import express from "express";
import setting from "./lib/setting";
import logging from "./lib/logging";
import log from "./module/log";
import route from "./route";
import envConfig from "./config/env";
import expressWs from "express-ws";
import { webSocketInit } from "./module/socket/socket";
import IntervalManager from "./lib/interval";

if (process.env.NODE_ENV !== "production") {
    require("source-map-support").install();
}

async function main() {
    const PORT = envConfig.PORT ?? 4000;

    const server = express();
    server.set("trust proxy", 1);

    server.use(setting);
    server.use(logging);
    server.use("/api", route);
    server.use("/api/temp", express.static("./static"));

    webSocketInit(expressWs(server).app);

    server.listen(PORT, () => {
        IntervalManager.run();
        console.log(`██████╗░██╗  ░█████╗░░█████╗░██████╗░███████╗  ░██████╗███████╗██████╗░██╗░░░██╗███████╗██████╗░`);
        console.log(`██╔══██╗██║  ██╔══██╗██╔══██╗██╔══██╗██╔════╝  ██╔════╝██╔════╝██╔══██╗██║░░░██║██╔════╝██╔══██╗`);
        console.log(`██████╔╝██║  ██║░░╚═╝██║░░██║██║░░██║█████╗░░  ╚█████╗░█████╗░░██████╔╝╚██╗░██╔╝█████╗░░██████╔╝`);
        console.log(`██╔═══╝░██║  ██║░░██╗██║░░██║██║░░██║██╔══╝░░  ░╚═══██╗██╔══╝░░██╔══██╗░╚████╔╝░██╔══╝░░██╔══██╗`);
        console.log(`██║░░░░░██║  ╚█████╔╝╚█████╔╝██████╔╝███████╗  ██████╔╝███████╗██║░░██║░░╚██╔╝░░███████╗██║░░██║`);
        console.log(`╚═╝░░░░░╚═╝  ░╚════╝░░╚════╝░╚═════╝░╚══════╝  ╚═════╝░╚══════╝╚═╝░░╚═╝░░░╚═╝░░░╚══════╝╚═╝░░╚═╝`);
        log.info(`Start PICode server - 0.0.0.0:${PORT}`);
    });
}

main();

process.on("SIGINT", () => {
    console.log();
    log.info(`Quit PICode Sever`);
    process.exit();
});
