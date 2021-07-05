import express from 'express';
import cors from 'cors'
import session from 'express-session'
const router = express.Router()

// body-parser setting
router.use(express.json())
router.use(express.urlencoded({ extended: false }))

// cors setting
router.use(cors({
    origin: '*',
    methods: ['GET', 'PUT', 'POST', 'DELETE']
}))

// session setting
router.use(session({
    secret: 'session-secret-key',
    resave: false,
    saveUninitialized: false
}))

export default router