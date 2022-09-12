export type FirebaseAuthBody = {
  email: string
  password: string
  returnSecureToken: boolean
}

export type FirebaseSignupResponse = {
  idToken: string
  email: string
  refreshToken: string
  expiresIn: string
  localId: string
}

export type FirebaseSigninResponse = {
  idToken: string
  email: string
  refreshToken: string
  expiresIn: string
  localId: string
  registered: string
}

export type FirebaseRefreshTokenBody = {
  grant_type: string
  refresh_token: string
}

export type FirebaseRefreshTokenResponse = {
  expires_in: string
  token_type: string
  refresh_token: string
  id_token: string
  user_id: string
  project_id: string
}

export class FirebaseError extends Error {
  constructor(message: string) {
    super(message)
  }
}
