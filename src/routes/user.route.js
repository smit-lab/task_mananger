import { Router } from 'express'
import {
  loginUser,
  logoutUser,
  registerUser,
} from '../controllers/user.controller.js'
import { verifyJWT } from '../middelwares/auth.middelware.js'

const router = Router()

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').post(verifyJWT, logoutUser)

export default router
