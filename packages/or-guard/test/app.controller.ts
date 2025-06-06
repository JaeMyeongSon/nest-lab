import { Controller, Get, UnauthorizedException, UseGuards } from '@nestjs/common';

import { AndGuard, OrGuard } from '../src';
import { ObsGuard } from './obs.guard';
import { PromGuard } from './prom.guard';
import { ReadUserGuard } from './read-user.guard';
import { SetUserGuard } from './set-user.guard';
import { SyncGuard } from './sync.guard';
import { ThrowGuard } from './throw.guard';

@Controller()
export class AppController {
  private message = 'Hello World';
  @UseGuards(OrGuard([ObsGuard, PromGuard, SyncGuard]))
  @Get()
  getHello() {
    return this.message;
  }

  @UseGuards(OrGuard([ThrowGuard, SyncGuard]))
  @Get('do-not-throw')
  getThrowGuard() {
    return this.message;
  }

  @UseGuards(OrGuard([ThrowGuard, SyncGuard], { throwOnFirstError: true }))
  @Get('throw')
  getThrowGuardThrow() {
    return this.message;
  }

  @UseGuards(OrGuard([SyncGuard, ThrowGuard], { throwLastError: true }))
  @Get('throw-last')
  getThrowGuardThrowLast() {
    return this.message;
  }

  @UseGuards(OrGuard([ThrowGuard, ThrowGuard], { throwError: new UnauthorizedException('Should provide either "x-api-key" header or query') }))
  @Get('throw-custom')
  getThrowGuardThrowCustom() {
    return this.message;
  }

  @UseGuards(OrGuard([ThrowGuard, ThrowGuard], { throwError: (errors) => new UnauthorizedException((errors as { message?: string }[]).filter(error => error.message).join(', ')) }))
  @Get('throw-custom-narrow')
  getThrowGuardThrowCustomNarrow() {
    return this.message;
  }

  @UseGuards(OrGuard(['SyncAndProm', ObsGuard]))
  @Get('logical-and')
  getLogicalAnd() {
    return this.message;
  }

  @UseGuards(AndGuard([SetUserGuard, ReadUserGuard]))
  @Get('set-user-fail')
  getSetUserFail() {
    return this.message;
  }

  @UseGuards(AndGuard([SetUserGuard, ReadUserGuard], { sequential: true }))
  @Get('set-user-pass')
  getSetUserPass() {
    return this.message;
  }
}
