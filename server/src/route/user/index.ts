import express from 'express'
import user from './user'
import sign from './sign'

const router = express.Router()

router.use('/', user)
router.use('/sign', sign)

export default router