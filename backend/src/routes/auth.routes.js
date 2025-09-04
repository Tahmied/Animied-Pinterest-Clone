import { Router } from 'express'
import { loginUser, registerUser } from '../controllers/auth.controller.js'
import { mediaUpload } from '../middleware/multer.middleware.js'

const router = Router()

router.post('/register' , mediaUpload('/dp').single('dp'), registerUser)
router.get('/login' , loginUser)

export default router