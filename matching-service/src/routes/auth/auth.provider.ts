import { ResultAsync } from 'neverthrow'
import {
  AuthProviderFail,
  AuthProviderSuccess,
  InternalAuthFail,
  InternalAuthSuccess,
  RefreshTokenSuccess,
} from './auth.model'
import { firebase } from './firebase/firebase.service'

/**
 * AuthProvider provides the interface to which any auth provider should
 * adhere to, for ease of plug and play so if we move away from Firebase
 * in the future, refactoring is as simple as writing a class for a new
 * provider who adheres to this interface, and no code change is required
 * in the AuthService
 */
export interface AuthProvider {
  /**
   * Allows user to sign in with an account
   * @param email
   * @param password
   */
  signInWithEmailAndPassword(
    email: string,
    password: string
  ): ResultAsync<AuthProviderSuccess, AuthProviderFail>

  signUpWithEmailAndPassword(
    email: string,
    password: string
  ): ResultAsync<AuthProviderSuccess, AuthProviderFail>

  verifyAccessToken(
    accessToken: string
  ): ResultAsync<InternalAuthSuccess, InternalAuthFail>

  refreshTokens(
    refreshToken: string
  ): ResultAsync<RefreshTokenSuccess, InternalAuthFail>
}

/**
 * Provides singleton instance of AuthProvider in use
 */
export const authProvider: AuthProvider = firebase
