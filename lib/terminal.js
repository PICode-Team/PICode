const os = require("os");
const pty = require("node-pty");

let ptyProcess;

process.on("message", (message) => {
    switch (message.type) {
        case "command": {
            workerCommand(message);
            break;
        }
        case "exit": {
            workerExit();
            break;
        }
        case "setup": {
            workerSetUp(message);
            ptyProcess.on("data", function (data) {
                process.send({ type: "command", command: data });
            });
            break;
        }
        default: {
            process.send({ type: "setup", command: `not found message type` });
            break;
        }
    }
});

function workerCommand(message) {
    message.command === "exit" ? workerExit() : ptyProcess.write(`${message.command}\r`);
}

function workerExit() {
    process.send({ type: "exit" });
    process.exit(0);
}

function workerSetUp(message) {
    const shell = os.platform() === "win32" ? "powershell.exe" : "bash";
    if (message.setupData === undefined) {
        process.send({ type: "setup", command: `no setupData from message` });
        process.exit(0);
    }

    ptyProcess = pty.spawn(shell, [], {
        name: "xterm-color",
        cols: message.setupData.size.cols ?? 150,
        rows: message.setupData.size.rows ?? 100,
        cwd: message.setupData.workspacePath,
    });
}