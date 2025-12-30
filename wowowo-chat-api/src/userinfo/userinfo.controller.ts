import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from './userinfo.dto';
import { UserinfoService } from './userinfo.service';

@Controller('userinfo')
export class UserinfoController {
  constructor(private readonly userinfoService: UserinfoService) {}

  @Post('register')
  async registerUser(@Body() registerDto: RegisterUserDto) {
    try {
      const user = await this.userinfoService.registerUser(registerDto);
      return {
        result: {
          phoneNumber: user.phoneNumber,
        },
        message: '这是一个注册接口',
      };
    } catch (error) {
      throw new BadRequestException(error.message || '注册失败');
    }
  }

  @Post('login')
  async loginUser(@Body() loginDto: LoginUserDto) {
    try {
      const user = await this.userinfoService.loginUser(loginDto);
      return {
        result: {
          phoneNumber: user.phoneNumber,
        },
        message: '这是一个登录接口',
      };
    } catch (error) {
      throw new BadRequestException(error.message || '登录失败');
    }
  }
}
