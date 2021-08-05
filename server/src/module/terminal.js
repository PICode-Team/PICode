const {
    parentPort
} = require('worker_threads');
const os = require('os')
const pty = require("node-pty");
const cluster = require('cluster')

if (cluster.isMaster) {
        const childProcess = cluster.fork()
        parentPort.on('message', (msg) => {
            childProcess.send(msg)
        });

        childProcess.on('message', msg => {
            parentPort.postMessage(msg);
        })
} else if(cluster.isWorker) {
    let ptyProcess;
    process.on('message', (message) => {
        switch(message.type){
            case 'command':{
                workerCommand(message, ptyProcess)
                break;
            }
            case 'exit':{
                workerExit(message);
                break;
            }
            case 'setup':{
                ptyProcess = workerSetUp(message);
                ptyProcess.on("data", function (data) {
                    process.send({ type: "command", command: data });
                });
                break;
            }
            default:{
                parentPort.postMessage({ type: "setup", command: `not found message type` });
                break;
            }
        }
    })

}

function workerCommand(message, ptyProcess) {
    message.command === "exit" ? workerExit() : ptyProcess.write(`${message.command}\r`);
}

function workerExit() {
    process.send({ type: "exit" });
    process.exit(0);
}

function workerSetUp(message) {
    const shell = os.platform() === "win32" ? "powershell.exe" : "bash";
    const pty = require("node-pty");
    if (message.setupData === undefined) {
        process.send({ type: "setup", command: `no setupData from message` });
        process.exit(0);
    }
    const ptyProcess = pty.spawn(shell, [], {
        name: "xterm-color",
        cols: message.setupData.size.cols ?? 150,
        rows: message.setupData.size.rows ?? 100,
        cwd: message.setupData.projectPath,
    });
    return ptyProcess;
}