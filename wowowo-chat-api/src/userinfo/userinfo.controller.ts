import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from './userinfo.dto';

@Controller('userinfo')
export class UserinfoController {
  @Post('registeruser')
  registerUser(@Body() body: RegisterUserDto) {
    const { phoneNumber, password, confirmPassword } = body;
    if (password !== confirmPassword) {
      throw new BadRequestException(['两次密码输入不一致']); // 这个可以将错误抛到异常过滤器中
    }

    // 进行存储数据库操作

    return {
      result: {
        phoneNumber,
        password,
        confirmPassword,
      },
      message: '这是一个注册接口',
    };
  }

  @Get('loginuser')
  loginUser() {
    return {
      result: {},
      message: '这是一个登录接口',
    };
  }
}
