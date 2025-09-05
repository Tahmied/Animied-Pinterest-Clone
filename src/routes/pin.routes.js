import { Router } from "express";
import { createPin, getPins, GetUserPins } from "../controllers/pin.controller.js";
import { findUser } from "../middleware/auth.middleware.js";
import { mediaUpload } from "../middleware/multer.middleware.js";
const router = Router()

router.post('/publish-pin', findUser, mediaUpload('/pins').single('pin'), createPin)
router.get('/pins', findUser, getPins)
router.get('/userPins', findUser, GetUserPins)

export default router