import express from 'express'
import { ResponseCode } from '../../constants/response'
import sessionRouter from '../../lib/router/session'
import DataUserManager from '../../module/data/userManager'
import log from '../../module/log'

const router = express.Router()

router.get('/', sessionRouter, (req, res) => {
    const userId = req.session.userId as string
    const userData = DataUserManager.get(userId)

    if (userData === undefined) {
        return res.json({ code: ResponseCode.invaildRequest })
    }

    return res.json({ code: ResponseCode.ok, user: { ...userData, passwd: undefined } })
})

router.post('/', (req, res) => {
    const userId = req.body?.userId
    const passwd = req.body?.passwd
    const userName = req.body?.userName
    const userThumnail = ''

    if (userId === undefined || passwd === undefined || userName === undefined || userThumnail === undefined) {
        return res.json({ code: ResponseCode.missingParameter })
    }
    if (typeof userId !== 'string' || typeof passwd !== 'string' || typeof userName !== 'string' || typeof userThumnail !== 'string') {
        return res.json({ code: ResponseCode.invaildParameterType })
    }

    if (!DataUserManager.create({ userId, userName, passwd, userThumnail })) {
        return res.json({ code: ResponseCode.internalError })
    }

    log.info(`Create user account (userId: "${userId}")`)

    return res.json({ code: ResponseCode.created })
})

router.put('/', sessionRouter, (req, res) => {
    const userId = req.session.userId as string
    const passwd = req.body.passwd
    const userName = req.body.userName
    const userThumnail = ''

    if (userId === undefined || passwd === undefined || userName === undefined || userThumnail === undefined) {
        return res.json({ code: ResponseCode.missingParameter })
    }
    if (typeof userId !== 'string' || typeof passwd !== 'string' || typeof userName !== 'string' || typeof userThumnail !== 'string') {
        return res.json({ code: ResponseCode.invaildParameterType })
    }

    if (!DataUserManager.update({ userId, passwd, userName, userThumnail })) {
        return res.json({ code: ResponseCode.invaildParameterType })
    }

    return res.json({ code: ResponseCode.ok })
})

router.delete('/', sessionRouter, (req, res) => {
    const userId = req.session.userId as string

    DataUserManager.delete(userId)
    log.info(`Delete user account (userId: "${userId}")`)

    req.session.userId = undefined
    req.session.userName = undefined
    req.session.destroy(err => {
        if (err) {
            log.error(err)
        }
    })

    return res.json({ code: ResponseCode.ok })
})

export default router