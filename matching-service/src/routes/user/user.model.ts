import { UserDocument } from '../../mongo/user/user.model'

export class UserError extends Error {
  constructor(message: string) {
    super(message)
  }
}

export type UserSuccess = {
  success: true
  data: UserDocument
}

export type UserFailure = {
  success: false
  message: string
}
