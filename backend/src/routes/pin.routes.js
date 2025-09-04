import { Router } from "express";
import { createPin } from "../controllers/pin.controller.js";
import { findUser } from "../middleware/auth.middleware.js";
import { mediaUpload } from "../middleware/multer.middleware.js";
const router = Router()

router.post('/publish-pin', findUser, mediaUpload('/pins').single('pin'), createPin)

export default router