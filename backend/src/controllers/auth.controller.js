import fs from 'fs';
import path from 'path';
import { fileURLToPath } from "url";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const registerUser = asyncHandler(async (req , res) => {
    let {name , email, password} = req.body
    if([name,email,password].some((e)=>!e)){
        throw new ApiError(400 , 'all fields are required')
    }
    
    let dpLocalPath = req.file ? `/dp/${req.file.filename}` : null

    try {
        await User.create({
            name , email, password, dpLocalPath
        })
        return res.status(200).json(
            new ApiResponse(200 , [] , 'User registered successfully')
        )
    } catch (error) {
        if (req.file) {
            fs.unlink(
                path.join(__dirname, `../public/uploads/dp/${req.file.filename}`),
                (err) => {
                    if (err) console.error("Failed to delete uploaded file:", err)
                }
            )
        }
        throw new ApiError(500 , `couldn't register the user due to ${error}`)
        }
})