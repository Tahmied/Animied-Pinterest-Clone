import { Router } from 'express'
import { registerUser } from '../controllers/auth.controller.js'
import { mediaUpload } from '../middleware/multer.middleware.js'

const router = Router()

router.post('/register' , mediaUpload('/dp').single('dp'), registerUser)

export default router