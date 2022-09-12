import { okAsync, ResultAsync } from 'neverthrow'
import { v4 as uuidv4 } from 'uuid'
import { models } from '../../mongo'
import { Difficulty, RoomDocument } from '../../mongo/rooms/rooms.model'
import { MatchError, MatchFailure, MatchSuccess } from './match.model'

export class MatchService {
  matchOrCreateRoom(
    difficulty: Difficulty,
    userId: string
  ): Promise<MatchSuccess | MatchFailure> {
    return this.matchByDifficulty(difficulty)
      .andThen((maybeMatchedRoom) =>
        this.addUserToRoomIfExistsOrCreateNewRoom(
          maybeMatchedRoom,
          difficulty,
          userId
        )
      )
      .match<MatchSuccess | MatchFailure>(
        this.roomToResult,
        this.errorToFailResult
      )
  }

  matchByDifficulty(
    difficulty: Difficulty
  ): ResultAsync<RoomDocument | null, MatchError> {
    const getEmptyRoom = models.rooms
      .findOne({ isLookingForMatch: true, difficulty })
      .exec()
    return ResultAsync.fromPromise(getEmptyRoom, this.catchMongooseError)
  }

  addUserToRoomIfExistsOrCreateNewRoom(
    maybeRoomDocument: RoomDocument | null,
    difficulty: Difficulty,
    userId: string
  ) {
    if (maybeRoomDocument == null)
      return this.createEmptyRoom(difficulty, userId)

    maybeRoomDocument.users = [...maybeRoomDocument.users, userId]
    maybeRoomDocument.isLookingForMatch = false

    return ResultAsync.fromPromise(
      maybeRoomDocument.save(),
      this.catchMongooseError
    )
  }

  createEmptyRoom(
    difficulty: Difficulty,
    userId: string
  ): ResultAsync<RoomDocument, MatchError> {
    const newUuid = uuidv4()
    const createEmptyRoom = models.rooms.create({
      _id: newUuid,
      users: [userId],
      difficulty,
      isLookingForMatch: true,
    })
    return ResultAsync.fromPromise(createEmptyRoom, this.catchMongooseError)
  }

  async leaveRoom(roomId: string, userId: string) {
    const room = await models.rooms.findById(roomId).exec()

    // can't find room, don't do anything
    if (room === null) return

    // remove user from room, ensure room is no longer looking for match
    const userIndex = room.users.indexOf(userId)
    room.isLookingForMatch = false
    room.users.splice(userIndex, 1)

    return room.save()
  }

  private roomToResult(room: RoomDocument): MatchSuccess {
    return {
      success: true,
      roomId: room._id,
    }
  }

  private errorToFailResult(e: MatchError): MatchFailure {
    return {
      success: false,
      message: e.message,
    }
  }

  private catchMongooseError(e: unknown) {
    // TODO: Actually catch Mongoose error
    if (e instanceof Error) {
      return new MatchError(e.message)
    }
    return new MatchError('Unknown error from User Service')
  }
}

/** Singleton instance of MatchService */
export const matchService = new MatchService()
