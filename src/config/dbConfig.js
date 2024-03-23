import mongoose from 'mongoose'
import { DB_NAME } from '../constant.js'

const connect = async () => {
  try {
    const connection = await mongoose.connect(
      `${process.env.MONGO_URI}/${DB_NAME}`
    )
    console.log('MongoDB connected here: ', connection)
  } catch (error) {
    console.log('This is DB connection error: ', error)
  }
}

export default connect
