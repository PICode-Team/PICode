import express from 'express';
import cors from 'cors'
import compression from 'compression'
import cookieParser from 'cookie-parser'
const router = express.Router()

// body-parser setting
router.use(express.json())
router.use(express.urlencoded({ extended: false }))

// cors setting
router.use(cors({
    origin: '*',
    methods: ['GET', 'PUT', 'POST', 'DELETE']
}))

// cookie parser setting
router.use(cookieParser('secretKey'))

// compression setting
router.use(compression())

export default router