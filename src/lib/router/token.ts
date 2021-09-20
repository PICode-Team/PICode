import express from 'express'
import { ResponseCode } from '../../constants/response'
import { verifyToken } from '../../module/token'

const tokenRouter = express.Router()

tokenRouter.all('*', (req, res, next)=>{
    try {
        req.token = verifyToken(req.cookies.authorization)
        next()
    } catch { }

    return res.json({ code: ResponseCode.unauthorized })
})

export default tokenRouter