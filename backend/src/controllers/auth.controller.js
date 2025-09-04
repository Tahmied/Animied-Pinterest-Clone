import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req , res) => {
    let {name , email, password} = req.body
    if([name,email,password].some((e)=>!e)){
        throw new ApiError(400 , 'all fields are required')
    }
    // add profile pic field here

    await User.create({
        name , email, password
    })
})