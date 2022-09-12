import { model, Schema, Model } from 'mongoose'
import { RoomDocument } from './rooms.model'

const roomDocument: Schema = new Schema({
  id: String,
  users: [String],
  difficulty: String,
  isLookingForMatch: Boolean
})

export const rooms: Model<RoomDocument> = model('rooms', roomDocument)
