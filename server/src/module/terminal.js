const { parentPort } = require("worker_threads");
const net = require("net");

const ip = "127.0.0.1";
const port = 3000;

const socket = new net.Socket();
socket.connect({ host: ip, port: port }, function () {
    function serialize(data) {
        return JSON.stringify(data);
    }

    parentPort.on("message", (msg) => {
        socket.write(serialize(msg));
    });

    socket.on("data", function (chunk) {
        const data = JSON.parse(chunk.toString());
        switch (data.type) {
            case "command": {
                parentPort.postMessage({ type: "command", command: data.command });
                break;
            }
            case "setup": {
                socket.write(serialize({ type: "command", command: "ls" }));
                break;
            }
            case "exit": {
                parentPort.postMessage({ type: "exit" });
                socket.destroy();
                break;
            }
        }
    });

    socket.on("end", function () {
        console.log("Disconnected");
    });
});
