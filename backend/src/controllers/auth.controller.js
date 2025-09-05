import fs from 'fs';
import path from 'path';
import { fileURLToPath } from "url";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function generateAccessTokenAndRefreshToken(userId){
    let user = await User.findById(userId)
    if(!user){
        throw new ApiError(500 , 'unable to find the user to generate tokens')
    }

    let accessToken = user.generateAccessToken()
    let refreshToken = user.generateRefreshToken()

    if(!accessToken || !refreshToken) {
        throw new ApiError(500 , 'unable to generate access and refresh token for user')
    }

    user.accessToken = accessToken
    user.refreshToken = refreshToken
    await user.save({validateBeforeSave : false})

    return { "accessToken" :  accessToken , "refreshToken" : refreshToken}
}

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

export const loginUser = asyncHandler(async (req,res)=>{
    let {email , password} = req.body
    if(!email || !password){
        throw new ApiError(400 , 'email and password are required')
    }
    
    let user = await User.findOne({email : email})
    if(!user){
        throw new ApiError(404 , `No User found with this email`)
    }

    let checkPass = await user.isPassCorrect(password)
    if(!checkPass){
        throw new ApiError(400 , 'wrong password')
    }

    let {accessToken , refreshToken} = await generateAccessTokenAndRefreshToken(user._id)

    if(!accessToken || !refreshToken) {
        throw new ApiError(500 , 'unable to login due to not found access and refresh token for user')
    }

    let cookieOptions = {
        httpOnly : true,
        secure : process.env.NODE_ENV === 'production',
        sameSite : 'strict'
    }

    return res.status(200)
    .cookie('AccessToken' , accessToken, cookieOptions)
    .cookie('RefreshToken' , refreshToken, cookieOptions)
    .json(
        new ApiResponse(200 , [] ,'user logged in')
    )

})

export const refreshToken = asyncHandler(async (req , res) => {
    // find the current user based on current refresh token
    let user = req.user
    if(!user){
        throw new ApiError(400 , 'unable to find the user to refresh token')
    }
    // generate new access and refresh token
    let {accessToken , refreshToken} = await generateAccessTokenAndRefreshToken(user._id)
    if(!accessToken || !refreshToken) {
        throw new ApiError(500 , 'unable to generate access and refresh token for user to refresh the tokens')
    }

    // set the new access and refresh token to cookies
    let cookieOptions = {
        httpOnly : true,
        secure : process.env.NODE_ENV === 'production',
        sameSite : 'strict'
    }

    if(accessToken || refreshToken){
        return res.status(200)
        .cookie("AccessToken", accessToken, cookieOptions)
        .cookie("RefreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(200, null , 'tokens refreshed')
        )
    }
})

export const checkLogin = asyncHandler(async (req,res)=>{
    let user = req.user
    if(!user){
        return res.status(200).json(
            new ApiResponse(200 , {isLoggedIn : false}, 'user is not logged in')
        )
    }
    return res.status(200).json(
        new ApiResponse(200 , {isLoggedIn : true}, 'user is logged in')
    )
})

export const logOut = asyncHandler(async (req,res)=>{
    let user = req.user
    if(!user){
        throw new ApiError( 404 ,`user not found to logout`)
    }

    user.accessToken = null
    user.refreshToken = null
    await user.save()

    let cookieOptions = {
        httpOnly : true,
        secure : process.env.NODE_ENV === 'production',
        sameSite : 'strict'
    }

    return res.status(200)
    .clearCookie('AccessToken', cookieOptions)
    .clearCookie('RefreshToken', cookieOptions)
    .json(
        new ApiResponse(200 , null , 'user logged out sucksexfully')
    )
})