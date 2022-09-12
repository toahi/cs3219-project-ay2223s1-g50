import axios, { AxiosResponse } from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { Auth, getAuth } from 'firebase-admin/auth'
import { App, initializeApp, applicationDefault } from 'firebase-admin/app'
import { ResultAsync } from 'neverthrow'
import {
  AuthProviderFail,
  AuthProviderSuccess,
  InternalAuthFail,
  InternalAuthSuccess,
  RefreshTokenSuccess,
} from '../auth.model'
import { AuthProvider } from '../auth.provider'
import {
  FirebaseSigninResponse,
  FirebaseAuthBody,
  FirebaseError,
  FirebaseRefreshTokenBody,
  FirebaseRefreshTokenResponse,
} from './firebase.model'
import { Logger } from '../../../utils/logger'
import { models } from '../../../mongo'
import { UserProfileRole } from '../../../mongo/user/user.model'

/**
 * Wrapper written based on class
 * https://firebase.google.com/docs/reference/rest/auth
 */
class FirebaseService implements AuthProvider {
  private static readonly ENDPOINT = 'https://identitytoolkit.googleapis.com/v1'
  private readonly apiKey: string
  private readonly fbApp: App
  private readonly fbAuth: Auth

  constructor(apiKey: string) {
    this.apiKey = apiKey
    this.fbApp = initializeApp({ credential: applicationDefault() })
    this.fbAuth = getAuth(this.fbApp)
  }

  signUpWithEmailAndPassword(
    email: string,
    password: string
  ): ResultAsync<AuthProviderSuccess, AuthProviderFail> {
    const newUuid = uuidv4()

    const createUserPromise = this.fbAuth.createUser({
      uid: newUuid,
      email,
      password,
    })

    return (
      ResultAsync.fromPromise(
        createUserPromise,
        FirebaseService.catchFirebaseError
      )
        // TODO: Refactor the logic for creating a user away from firebase service
        // this is a code smell, firebase service should not be responsible for creating mongo
        // user but this is the "easiest" way to do it atm, but refactor this away in the future
        .andThen((_) => this.createNewUserInMongo(newUuid, email))
        .andThen((_) => this.signInWithEmailAndPassword(email, password))
    )
  }

  createNewUserInMongo(id: string, email: string) {
    const createUserPromise = models.users.create({
      _id: id,
      // TODO: Change default user roles here
      roles: [UserProfileRole.Read, UserProfileRole.Write],
      email,
    })

    return ResultAsync.fromPromise(
      createUserPromise,
      FirebaseService.catchFirebaseError
    )
  }

  signInWithEmailAndPassword(
    email: string,
    password: string
  ): ResultAsync<AuthProviderSuccess, AuthProviderFail> {
    const body: FirebaseAuthBody = {
      email,
      password,
      returnSecureToken: true, // should always be true according to docs
    }
    const url = `${FirebaseService.ENDPOINT}/accounts:signInWithPassword?key=${this.apiKey}`

    const responsePromise: Promise<AxiosResponse<FirebaseSigninResponse>> =
      axios.post(url, body)

    return ResultAsync.fromPromise(
      responsePromise,
      FirebaseService.catchFirebaseError
    )
      .map(
        ({ data: { idToken, refreshToken } }): AuthProviderSuccess => ({
          authToken: idToken,
          refreshToken,
        })
      )
      .mapErr((e): AuthProviderFail => ({ message: e.message }))
  }

  refreshTokens(
    refreshToken: string
  ): ResultAsync<RefreshTokenSuccess, InternalAuthFail> {
    const body: FirebaseRefreshTokenBody = {
      refresh_token: refreshToken,
      grant_type: 'refresh_token', // always 'refresh_token' according to docs
    }
    const url = `${FirebaseService.ENDPOINT}/token?key=${this.apiKey}`

    const responsePromise: Promise<
      AxiosResponse<FirebaseRefreshTokenResponse>
    > = axios.post(url, body)

    return ResultAsync.fromPromise(
      responsePromise,
      FirebaseService.catchFirebaseError
    )
      .map(({ data: { id_token: authToken } }) => ({ authToken }))
      .mapErr((e): InternalAuthFail => ({ message: e.message }))
  }

  verifyAccessToken(
    accessToken: string
  ): ResultAsync<InternalAuthSuccess, InternalAuthFail> {
    const verifyTokenPromise = this.fbAuth.verifyIdToken(accessToken)

    return ResultAsync.fromPromise(
      verifyTokenPromise,
      FirebaseService.catchFirebaseError
    )
      .map(
        (decodedToken): InternalAuthSuccess => ({ userUuid: decodedToken.uid })
      )
      .mapErr((e) => ({
        message: e.message,
      }))
  }

  private static catchFirebaseError(e: unknown) {
    if (axios.isAxiosError(e)) {
      const errorMessageMaybe = e.response?.data.error.message ?? e.message
      const readableErrorMessage =
        FirebaseService.matchFirebaseErrorMessages(errorMessageMaybe)
      return new FirebaseError(readableErrorMessage)
    } else if (e instanceof Error) {
      Logger.error('Error', e)
      return new FirebaseError(e.message)
    }
    return new FirebaseError(`Error with authentication provider`)
  }

  private static matchFirebaseErrorMessages(message: string) {
    switch (message) {
      case 'EMAIL_EXISTS':
      case 'EMAIL_NOT_FOUND':
      case 'INVALID_PASSWORD':
        return 'Please check your email and password combination and try again.'
      case 'OPERATION_NOT_ALLOWED':
        return 'Password sign in is not allowed.'
      case 'TOO_MANY_ATTEMPTS_TRY_LATER':
        return 'Too many attempts have been made from your IP address.'
      case 'USER_DISABLED':
        return 'Your account has been disabled.'
      default:
        console.warn(`Firebase message ${message} is uncaught`)
        return 'An unknown error has occurred'
    }
  }
}

const firebaseApiKey = process.env.FIREBASE_API_KEY

// if (firebaseApiKey === undefined) {
//   throw new Error('Firebase API Key is not defined in .env, please define it')
// }

/**
 * Singleton instance of class FirebaseService
 */
export const firebase = new FirebaseService('')
