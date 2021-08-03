import express from "express";
import setting from "./lib/setting";
import logging from "./lib/logging";
import log from "./module/log";
import route from "./route";
import graphQLServer from "./lib/graphql";
import next from "next";
import envConfig from "./config/env";
import expressWs from "express-ws";
import { webSocketInit } from "./module/socket/socket";
import cluster from "cluster";
import DataTerminalManager from "./module/data/terminalManager";

async function main() {
    const dev = envConfig.NODE_ENV !== "production";
    const onlyServer = (envConfig.MODE ?? "full") === "server";
    const PORT = envConfig.PORT ?? 4000;

    const server = express();
    server.set("trust proxy", 1);

    server.use(setting);
    server.use(logging);
    server.use("/api", route);
    server.use("/api/temp", express.static("./static"));
    graphQLServer.applyMiddleware({
        app: server,
        path: "/graphql",
        cors: false,
    });

    webSocketInit(expressWs(server).app);

    if (!onlyServer) {
        const app = next({ dev });
        const handle = app.getRequestHandler();

        await app.prepare();

        server.get("*", (req, res) => {
            return handle(req, res);
        });
    }

    server.listen(PORT, () => {
        console.log(
            `██████╗░██╗  ░█████╗░░█████╗░██████╗░███████╗  ░██████╗███████╗██████╗░██╗░░░██╗███████╗██████╗░`
        );
        console.log(
            `██╔══██╗██║  ██╔══██╗██╔══██╗██╔══██╗██╔════╝  ██╔════╝██╔════╝██╔══██╗██║░░░██║██╔════╝██╔══██╗`
        );
        console.log(
            `██████╔╝██║  ██║░░╚═╝██║░░██║██║░░██║█████╗░░  ╚█████╗░█████╗░░██████╔╝╚██╗░██╔╝█████╗░░██████╔╝`
        );
        console.log(
            `██╔═══╝░██║  ██║░░██╗██║░░██║██║░░██║██╔══╝░░  ░╚═══██╗██╔══╝░░██╔══██╗░╚████╔╝░██╔══╝░░██╔══██╗`
        );
        console.log(
            `██║░░░░░██║  ╚█████╔╝╚█████╔╝██████╔╝███████╗  ██████╔╝███████╗██║░░██║░░╚██╔╝░░███████╗██║░░██║`
        );
        console.log(
            `╚═╝░░░░░╚═╝  ░╚════╝░░╚════╝░╚═════╝░╚══════╝  ╚═════╝░╚══════╝╚═╝░░╚═╝░░░╚═╝░░░╚══════╝╚═╝░░╚═╝`
        );
        log.info(`Start PICode server - 0.0.0.0:${PORT}`);
    });
}

if (cluster.isMaster) {
    main();
} else if (cluster.isWorker) {
    DataTerminalManager.setUpTerminal();
}

process.on("SIGINT", () => {
    console.log();
    log.info(`Quit PICode Sever`);
    process.exit();
});
