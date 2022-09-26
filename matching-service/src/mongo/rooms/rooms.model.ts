import mongoose from 'mongoose'

export enum Difficulty {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard',
}

export type RoomDocument = {
  id: string
  users: string[]
  difficulty: string
} & mongoose.Document
