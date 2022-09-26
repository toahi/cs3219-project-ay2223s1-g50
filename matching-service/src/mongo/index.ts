import mongoose, { Mongoose } from 'mongoose'
import { rooms } from './rooms'

const DATABASE_URL = process.env.MONGODB_URI ?? 'mongodb://localhost:27017'

const connectDb: () => Promise<Mongoose> = () => {
  return mongoose.connect(DATABASE_URL)
}

// import model dependencies and put them inside here
export const models = {
  rooms,
}

export { connectDb }
