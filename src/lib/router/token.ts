import express from 'express'
import { ResponseCode } from '../../constants/response'
import { verifyToken } from '../../module/token'

const tokenRouter = express.Router()

tokenRouter.all('*', (req, res, next)=>{
    req.token = verifyToken(req.cookies.authorization)

    if (req.token === undefined) {
        return res.json({ code: ResponseCode.unauthorized })
    }

    return next()
})

export default tokenRouter