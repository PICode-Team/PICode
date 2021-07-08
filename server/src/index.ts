import express from 'express'
import setting from './lib/setting'
import logging from './lib/logging'
import log from './module/log'
import route from './route'
import graphQLServer from './lib/graphql'

const server = express()
const Port = 4000

server.set('trust proxy', 1)

server.use(setting)
server.use(logging)
server.use('/api', route)

graphQLServer.applyMiddleware({ app: server, path: '/graphql', cors: false })

server.listen(Port, () => {
    console.log(`██████╗░██╗  ░█████╗░░█████╗░██████╗░███████╗  ░██████╗███████╗██████╗░██╗░░░██╗███████╗██████╗░`)
    console.log(`██╔══██╗██║  ██╔══██╗██╔══██╗██╔══██╗██╔════╝  ██╔════╝██╔════╝██╔══██╗██║░░░██║██╔════╝██╔══██╗`)
    console.log(`██████╔╝██║  ██║░░╚═╝██║░░██║██║░░██║█████╗░░  ╚█████╗░█████╗░░██████╔╝╚██╗░██╔╝█████╗░░██████╔╝`)
    console.log(`██╔═══╝░██║  ██║░░██╗██║░░██║██║░░██║██╔══╝░░  ░╚═══██╗██╔══╝░░██╔══██╗░╚████╔╝░██╔══╝░░██╔══██╗`)
    console.log(`██║░░░░░██║  ╚█████╔╝╚█████╔╝██████╔╝███████╗  ██████╔╝███████╗██║░░██║░░╚██╔╝░░███████╗██║░░██║`)
    console.log(`╚═╝░░░░░╚═╝  ░╚════╝░░╚════╝░╚═════╝░╚══════╝  ╚═════╝░╚══════╝╚═╝░░╚═╝░░░╚═╝░░░╚══════╝╚═╝░░╚═╝`)
    log.info(`Start PICode server - 0.0.0.0:${Port}`)
})