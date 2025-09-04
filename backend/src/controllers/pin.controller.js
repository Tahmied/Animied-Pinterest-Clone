import { Pin } from '../models/pin.model.js';
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const createPin = asyncHandler (async (req,res) => {
    let {title} = req.body
    let user = req.user
    let imagePath = req.file ? `/pins/${req.file.filename}` : null
    if(!imagePath){
        throw new ApiError(400 , 'Image path is a reuired field')
    }
    try {
        await Pin.create(
            {
                title , imagePath, publishedBy : user._id
            }
        )
        let publishedpIn = await Pin.findOne({imagePath : imagePath})
        return res.status(200).json(
            new ApiResponse(201 , publishedpIn, 'pin published successfully' )
        )
    } catch (error) {
        console.log(`unable to create a pin due to ${error}`)
        throw new ApiError(500 , 'unable to create a pin')
    }
})

export const getPins = asyncHandler (async (req,res)=>{
    let page = parseInt(req.query.page) 
    let limit = parseInt(req.query.limit)
    
    if(!page){
        page = 1
    }
    if(!limit){
        limit = 10
    }

    let skip = (page - 1) * limit

    let pins = await Pin.find().sort({createdAt:-1}).skip(skip).limit(limit)
    

    let totalPins = await Pin.countDocuments()
    let totalPages = Math.ceil(totalPins/limit)

    res.status(200)
    .json(
        new ApiResponse(200 , {
            page , limit, totalPins, totalPages , pins 
        })
    )

})