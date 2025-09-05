import mongoose from 'mongoose';
import { Pin } from '../models/pin.model.js';
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const createPin = asyncHandler (async (req,res) => {
    let {title,tag} = req.body
    let user = req.user
    let imagePath = req.file ? `/uploads/pins/${req.file.filename}` : null
    if(!imagePath){
        throw new ApiError(400 , 'Image path is a reuired field')
    }
    try {
        await Pin.create(
            {
                title, tag , imagePath, publishedBy : user._id
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

export const GetUserPins = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) throw new ApiError(400, "user is a required field");

  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 10));
  const skip = (page - 1) * limit;

  if (!mongoose.Types.ObjectId.isValid(user._id)) {
    throw new ApiError(400, "please provide a valid user id");
  }

  const filter = { publishedBy: user._id };

  const [userPins, total] = await Promise.all([
    Pin.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Pin.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      { page, limit, total, totalPages, pins: userPins },
      "Pins fetched successfully"
    )
  );
});
