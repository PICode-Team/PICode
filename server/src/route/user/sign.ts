import express from 'express'
import { ResponseCode } from '../../constants/response'
import DataUserManager from '../../module/data/userManager'
import sessionRouter from '../../lib/router/session'
import log from '../../module/log'

const router = express.Router()

router.post('/', (req, res) => {
    const userId = req.body?.userId
    const passwd = req.body?.passwd

    if (userId === undefined || passwd === undefined) {
        return res.json({ code: ResponseCode.missingParameter })
    }

    const userData = DataUserManager.get(userId)

    if (userData === undefined) {
        return res.json({ code: ResponseCode.invaildRequest })
    } else if (userData.passwd !== passwd) {
        return res.json({ code: ResponseCode.invaildPasswd })
    }

    // save session
    req.session.userId = userId
    req.session.userName = userData.userName
    req.session.save()

    return res.json({ code: ResponseCode.created })
})

router.delete('/', sessionRouter, (req, res) => {
    req.session.userId = undefined
    req.session.userName = undefined
    req.session.destroy(err => {
        if (err) {
            log.error(err)
        }
    })

    res.json({ code: ResponseCode.ok })
})

export default router