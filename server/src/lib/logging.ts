import express from 'express'
import log from '../module/log'

const router = express.Router()

router.all('*', (req, res, next) => {
    const requestTime = new Date().getTime()
    res.on('finish', () => {
        const message = `${req.method} ${req.url} +${(new Date().getTime()) - requestTime}ms`

        if (res.statusCode < 400) {
            log.verbose(message)
        } else {
            log.error(message)
        }
    })

    next()
})

export default router