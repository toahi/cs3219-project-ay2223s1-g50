import { CookieSerializeOptions } from 'cookie'
import { CookieOptions } from 'express'
import jwt from 'jsonwebtoken'
import { currentDateAfterMs } from './date'

// If we use our own cookie signatures in the future
// if (
//   process.env.ACCESS_TOKEN_SECRET === undefined ||
//   process.env.REFRESH_TOKEN_SECRET === undefined
// ) {
//   throw new Error(
//     'Access Token Secret or Refresh Token Secret is / are undefined, please define it in `.env` before proceeding'
//   )
// }

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET ?? 'accessTokenSecret'
const refreshTokenSecret =
  process.env.REFRESH_TOKEN_SECRET ?? 'refreshTokenSecret'
const isProduction = process.env.NODE_ENVIRONMENT === 'production'

/**
 * Contains expiration time in ms of enum as value, where enum -> time in ms
 */
enum TokenExpiration {
  Access = 24 * 60 * 1000, // one day
  Refresh = 30 * 24 * 60 * 60 * 1000, // one month
}

export const defaultTokenCookieOptions: CookieSerializeOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'strict' : 'lax',
  domain: process.env.BASE_URL,
  path: '/',
}

/**
 * Set as a function as expires time needs to be evaluated statically
 */
export const accessTokenCookieOptions: () => CookieSerializeOptions = () => ({
  ...defaultTokenCookieOptions,
  expires: currentDateAfterMs(TokenExpiration.Access),
})

export const refreshTokenCookieOptions: () => CookieSerializeOptions = () => ({
  ...defaultTokenCookieOptions,
  expires: currentDateAfterMs(TokenExpiration.Refresh),
})

export const signTokenPayload = (
  payload: string,
  tokenSecret: string,
  expiration: TokenExpiration
) => jwt.sign(payload, tokenSecret, { expiresIn: expiration })

export const signAccessToken = (payload: string) =>
  signTokenPayload(payload, accessTokenSecret, TokenExpiration.Access)

export const signRefreshToken = (payload: string, tokenSecret: string) =>
  signTokenPayload(payload, refreshTokenSecret, TokenExpiration.Refresh)
