import winston from 'winston'
import { getTime } from './datetime'

export default winston.createLogger({
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple(),
                winston.format.printf(obj => {
                    return `[${getTime()}] \t [${obj.level}] ${obj.message}`
                })
            )
        })
    ]
})