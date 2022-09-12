import { Request, Response } from 'express'
import { InternalAuthSuccess } from '../routes/auth/auth.model'
import { authProvider } from '../routes/auth/auth.provider'
import { UserService, userService } from '../routes/user/user.service'

export interface RequestWithUser extends Request {
  user: InternalAuthSuccess
}

export const expressAuthentication = async (
  request: Request,
  securityName: string,
  scopes?: string[]
): Promise<InternalAuthSuccess> => {
  const promiseRejectError = (
    message: string = 'Auth cookie is required for authenticated routes'
  ) => Promise.reject(new Error(message))

  if (securityName === 'jwt') {
    const authToken = request.cookies?.auth
    const refreshToken = request.cookies?.refresh

    if (authToken === undefined && refreshToken === undefined) {
      return promiseRejectError()
    }

    return authProvider.verifyAccessToken(authToken).match(
      (success) => Promise.resolve(success),
      (failure) => promiseRejectError(failure.message)
    )
  }

  return promiseRejectError()
}
