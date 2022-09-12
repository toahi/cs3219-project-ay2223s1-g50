import { Difficulty } from '../../mongo/rooms/rooms.model'

export class MatchError extends Error {
  constructor(message: string) {
    super(message)
  }
}

export type FindMatchBody = {
  difficulty: Difficulty
}

export type LeaveRoomBody = {
  roomId: string
}

export type MatchSuccess = {
  success: true
  roomId: string
}

export type MatchFailure = {
  success: false
  message: string
}
