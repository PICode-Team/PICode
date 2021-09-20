import express from 'express'
import data from './data'

const router = express.Router()

router.use('/', data)

export default router