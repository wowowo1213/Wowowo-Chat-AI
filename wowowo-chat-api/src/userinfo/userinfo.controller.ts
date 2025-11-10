import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from './userinfo.dto';
import { UserinfoService } from './userinfo.service';

@Controller('userinfo')
export class UserinfoController {
  constructor(private readonly userinfoService: UserinfoService) {}

  // localhost:5000/userinfo/register，使用post
  @Post('register')
  async registerUser(@Body() registerDto: RegisterUserDto) {
    try {
      const user = await this.userinfoService.registerUser(registerDto);
      return {
        result: {
          phoneNumber: user.phoneNumber,
          password: user.password, // 实际不应返回，我们此处返回
          confirmPassword: user.confirmPassword, // 实际不应返回，我们此处返回
        },
        message: '这是一个注册接口',
      };
    } catch (error) {
      throw new BadRequestException(error.message || '注册失败');
    }
  }

  // localhost:5000/userinfo/login，使用post
  @Post('login')
  async loginUser(@Body() loginDto: LoginUserDto) {
    try {
      const user = await this.userinfoService.loginUser(loginDto);
      return {
        result: {
          phoneNumber: user.phoneNumber,
          password: user.password, // 实际不应返回，我们此处返回
        },
        message: '这是一个登录接口',
      };
    } catch (error) {
      throw new BadRequestException(error.message || '登录失败');
    }
  }
}
