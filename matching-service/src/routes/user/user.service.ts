import { ResultAsync } from 'neverthrow'
import { models } from '../../mongo'
import { UserDocument } from '../../mongo/user/user.model'
import { UserFailure, UserSuccess, UserError } from './user.model'

export class UserService {
  findById(id: string): Promise<UserSuccess | UserFailure> {
    const getUserPromise = models.users.findById(id).exec()

    return ResultAsync.fromPromise(
      getUserPromise,
      this.catchMongooseError
    ).match<UserSuccess | UserFailure>(
      this.userToResult,
      this.errorToFailResult
    )
  }

  private userToResult(user: UserDocument | null): UserSuccess | UserFailure {
    if (user === null) {
      return {
        success: false,
        message: 'No user with corresponding id was found',
      }
    }
    return {
      success: true,
      data: user,
    }
  }

  private errorToFailResult(e: UserError): UserFailure {
    return {
      success: false,
      message: e.message,
    }
  }

  private catchMongooseError(e: unknown) {
    // TODO: Actually catch Mongoose error
    if (e instanceof Error) {
      return new UserError(e.message)
    }
    return new UserError('Unknown error from User Service')
  }
}

/** Singleton instance of UserService */
export const userService = new UserService()
