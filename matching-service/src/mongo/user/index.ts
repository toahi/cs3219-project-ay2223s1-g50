import { model, Schema, Model } from 'mongoose'
import { UserDocument } from './user.model'

const userSchema: Schema = new Schema({
  _id: String,
  roles: [String],
  email: {
    type: String,
    unique: true,
  },
})

export const users: Model<UserDocument> = model('users', userSchema)
