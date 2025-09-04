import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'

const app = express()
app.use(cors({origin : process.env.ORIGIN}))
app.use(express.json({limit : '16kb'}))
app.use(express.urlencoded({extended : true , limit : '16kb'}))
app.use(cookieParser())
app.use(express.static('public'))

import authRoutes from './routes/auth.routes.js'
import pinRoutes from './routes/pin.routes.js'

app.use('/api/v1/users' , authRoutes)
app.use('/api/v1/pins' , pinRoutes)


export { app }
