import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { AppService } from './app.service';

import { AppDto } from './app.dto';

@Controller('user')
export class AppController {
  constructor(private readonly appService: AppService) {}

  // 用户登录的接口
  @Post('loginuser')
  loginUser(@Body() body: AppDto) {
    const { username, pwd } = body;

    const res = this.appService.loginUser(username, pwd);

    return {
      result: body,
      msg: res,
    };
  }

  @Get('queryuser')
  queryUser(@Query() userId: string) {}
}
