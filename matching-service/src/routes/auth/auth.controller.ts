import { Response as ExpressResponse } from 'express'
import {
  Body,
  Controller,
  Post,
  Res,
  Response,
  Route,
  SuccessResponse,
  Tags,
  TsoaResponse,
} from 'tsoa'
import { Failure, GENERIC_SUCCESS, Success } from '../../shared/shared.model'
import { AuthBody } from './auth.model'
import { authService, AuthService } from './auth.service'
import { serialize } from 'cookie'
import {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} from '../../utils/token'

@Route('auth')
@Tags('Authentication')
export class AuthController extends Controller {
  private readonly authService: AuthService

  constructor() {
    super()
    this.authService = authService
  }

  /**
   * Sets auth and refresh cookies on success
   */
  @SuccessResponse(201)
  @Response<Failure>(409)
  @Post('signup')
  async signup(
    @Body() authBody: AuthBody,
    @Res() success: TsoaResponse<201, Success>,
    @Res() failure: TsoaResponse<409, Failure>
  ): Promise<Success | Failure> {
    const signupRes = await this.authService.signup(authBody)
    if (signupRes.success) {
      const { authTokenCookie, refreshTokenCookie } =
        this.serializeAuthAndRefreshCookies(
          signupRes.authToken,
          signupRes.refreshToken
        )
      return success(201, GENERIC_SUCCESS, {
        'Set-Cookie': [authTokenCookie, refreshTokenCookie],
      })
    }

    return failure(409, signupRes)
  }

  /**
   * Sets auth and refresh cookies on success
   */
  @SuccessResponse(200)
  @Response<Failure>(401)
  @Post('login')
  async login(
    @Body() authBody: AuthBody,
    @Res() success: TsoaResponse<200, Success, { 'Set-Cookie': string[] }>,
    @Res() failure: TsoaResponse<401, Failure>
  ): Promise<Success | Failure> {
    const loginRes = await this.authService.login(authBody)
    if (loginRes.success) {
      const { authTokenCookie, refreshTokenCookie } =
        this.serializeAuthAndRefreshCookies(
          loginRes.authToken,
          loginRes.refreshToken
        )
      return success(200, GENERIC_SUCCESS, {
        'Set-Cookie': [authTokenCookie, refreshTokenCookie],
      })
    }

    return failure(401, loginRes)
  }

  private serializeAuthAndRefreshCookies(
    authToken: string,
    refreshToken: string
  ) {
    const authTokenCookie = serialize(
      'auth',
      authToken,
      accessTokenCookieOptions()
    )
    const refreshTokenCookie = serialize(
      'refresh',
      refreshToken,
      refreshTokenCookieOptions()
    )
    return { authTokenCookie, refreshTokenCookie }
  }
}
