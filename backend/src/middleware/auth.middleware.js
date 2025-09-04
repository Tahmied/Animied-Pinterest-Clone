import jwt from 'jsonwebtoken'
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"

export async function findUser(req,_,next) {
try {
        let accessToken = req.cookies?.AccessToken || req.header('Authorization')?.replace('Bearer ' ,'')
        if(!accessToken){
            throw new ApiError(400 , `access token not found`)
        }
    
        let decodedAccessToken = jwt.verify(accessToken , process.env.ACCESS_TOKEN_KEY)
        if(!decodedAccessToken){
            throw new ApiError(400 , 'can\'t decode access token')
        }
        
        let user = await User.findById(decodedAccessToken._id)
        if(!user){
            throw new ApiError(404 , 'user not found')
        }
        req.user = user
        next()
} catch (error) {
    if(error.name === 'JsonWebTokenError' || error.name === `TokenExpiredError`){
        return res.status(401).json(
            new ApiResponse(401 , null , 'Invalid or expired token')
        )
    }
    throw new ApiError( 401 , `auth middleware error - ${error}`)
}
}