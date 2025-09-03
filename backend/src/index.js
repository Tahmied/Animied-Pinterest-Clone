import dotenv from 'dotenv';
import { app } from "./app.js";
import { connectDB } from "./db/connectDb.js";

dotenv.config({
    path : './.env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 3000 , ()=>{
        console.log(`service is running on http://localhost:${process.env.PORT || 3000}`)
    })
})
.catch((err)=>{
    console.log(`Couldn\'t connected to the server in server.js due to ${err}`)
})