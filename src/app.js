import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(cookieParser())

import taskRoute from './routes/task.route.js'
import userRoute from './routes/user.route.js'

app.use('/api/v1/user', userRoute)
app.use('/api/v1/tasks', taskRoute)

export default app
