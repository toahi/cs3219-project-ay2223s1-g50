import { Failure } from '../../shared/shared.model'
import {
  AuthBody,
  AuthProviderSuccess,
  AuthSuccess,
  AuthProviderFail,
} from './auth.model'
import { authProvider } from './auth.provider'

export class AuthService {
  async signup(signupBody: AuthBody): Promise<AuthSuccess | Failure> {
    const { email, password } = signupBody

    const result = authProvider.signUpWithEmailAndPassword(email, password)

    return result.match<AuthSuccess | Failure>(
      this.successResponse,
      this.errorResponse
    )
  }

  async login(loginBody: AuthBody): Promise<AuthSuccess | Failure> {
    const { email, password } = loginBody

    const result = authProvider.signInWithEmailAndPassword(email, password)

    return result.match<AuthSuccess | Failure>(
      this.successResponse,
      this.errorResponse
    )
  }

  private successResponse(successResponse: AuthProviderSuccess): AuthSuccess {
    return {
      success: true,
      ...successResponse,
    }
  }

  private errorResponse(failResponse: AuthProviderFail): Failure {
    return {
      success: false,
      ...failResponse,
    }
  }
}

/** Singleton instance of authService */
export const authService = new AuthService()
