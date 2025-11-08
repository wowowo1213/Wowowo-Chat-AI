import { Injectable, BadRequestException } from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from './userinfo.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserinfoService {
  private users = new Map<string, { phoneNumber: string; password: string }>();

  async registerUser(registerDto: RegisterUserDto) {
    const { phoneNumber, password, confirmPassword } = registerDto;

    if (password !== confirmPassword) {
      throw new BadRequestException('两次输入的密码不一致');
    }

    if (this.users.has(phoneNumber)) {
      throw new BadRequestException('该手机号已注册');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 存储用户数据（仅内存，重启服务会丢失）
    this.users.set(phoneNumber, {
      phoneNumber,
      password: hashedPassword,
    });

    return {
      phoneNumber,
      password, // 实际不应返回，我们此处返回
      confirmPassword, // 实际不应返回，我们此处返回
    };
  }

  async loginUser(loginDto: LoginUserDto) {
    const { phoneNumber, password } = loginDto;

    const user = this.users.get(phoneNumber);
    if (!user) {
      throw new BadRequestException('用户不存在，请先注册');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('密码错误');
    }

    return {
      phoneNumber,
      password, // 实际不应返回，我们此处返回
    };
  }
}
