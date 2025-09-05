import { Router } from 'express'
import { checkLogin, loginUser, logOut, refreshToken, registerUser } from '../controllers/auth.controller.js'
import { findUser } from '../middleware/auth.middleware.js'
import { mediaUpload } from '../middleware/multer.middleware.js'

const router = Router()

router.post('/register' , mediaUpload('/dp').single('dp'), registerUser)
router.post('/login' , loginUser)
router.get('/refreshToken', findUser, refreshToken)
router.get('/checkLogin', findUser, checkLogin)
router.get('/logout', findUser, logOut)

export default router