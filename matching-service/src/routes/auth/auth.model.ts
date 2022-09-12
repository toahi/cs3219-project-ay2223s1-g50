export type AuthBody = {
  email: string
  password: string
}

export type AuthProviderSuccess = {
  authToken: string
  refreshToken: string
}

export type AuthProviderFail = {
  message: string
}

export type AuthSuccess = {
  success: true
  authToken: string
  refreshToken: string
}

export type RefreshTokenSuccess = {
  authToken: string
}

export type InternalAuthSuccess = {
  userUuid: string
}

export type InternalAuthFail = {
  message: string
}
