import express from 'express'
import test from './test'

const router = express.Router()

router.use('/', test)

export default router