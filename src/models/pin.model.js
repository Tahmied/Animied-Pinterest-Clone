import mongoose from "mongoose";

const pinSchema = new mongoose.Schema({
    title : {
        type: String,
    },
    imagePath : {
        type : String,
        required : true
    },
    publishedBy: {
        type : mongoose.Schema.Types.ObjectId,
        ref: "User",
        required : true
    },
    tag : {
        type: String,
        trim : true,
        required : false
    }
} , {
    timestamps : true
})

export const Pin = mongoose.model('Pin' , pinSchema)