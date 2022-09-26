import { model, Schema, Model } from 'mongoose'
import { RoomDocument } from './rooms.model'

const roomDocument: Schema = new Schema({
  _id: String,
  users: [String],
  difficulty: String,
})

export const rooms: Model<RoomDocument> = model('rooms', roomDocument)
