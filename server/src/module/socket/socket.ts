import WebSocket from "ws";
import { Server } from 'http'

export default function webSocketInit(server: Server) {
    const webSocketServer = new WebSocket.Server({ server, path: '/' });

    webSocketServer.on('connection', (socket, _) => {
        socket.on('message', data => {
            console.log('message', data)
            socket.send(data)
        })

        webSocketServer.on('error', err => {
            console.log(err)
        })

        webSocketServer.on('close', () => {
            console.log('close')
        })

    })
}

