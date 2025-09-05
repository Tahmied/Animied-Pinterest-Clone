import mongoose from "mongoose"

export const connectDB = async () => {
    try {
            let res = await  mongoose.connect(`${process.env.MONGODB_URI}/animied`)
            console.log(`db connected on ${res.connection.host}`) 
    } catch (err) {
        throw Error(`error connecting database in connectDb fun due to ${err}`)
    }
}


