import { Body, Controller, Delete, Path, Post, Route, Tags } from 'tsoa'
import { FindMatchBody } from './match.model'
import { MatchService, matchService } from './match.service'

@Route('match')
@Tags('Match')
export class MatchController extends Controller {
  private readonly matchService: MatchService

  constructor() {
    super()
    this.matchService = matchService
  }

  @Post()
  public async findMatch(@Body() body: FindMatchBody) {
    return this.matchService.matchOrCreateRoom(body.difficulty, '')
  }
}
