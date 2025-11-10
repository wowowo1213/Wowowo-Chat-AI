import { IsString, IsNotEmpty, Matches, MinLength, MaxLength } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^1[3-9]\d{9}$/, {
    message: '手机号格式不正确',
  })
  phoneNumber: string;

  @IsString()
  @MinLength(6, { message: '密码长度不能少于6位' })
  @MaxLength(20, { message: '密码长度不能超过20位' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message: '密码必须包含大小写字母和数字',
  })
  password: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  confirmPassword: string;
}

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @MinLength(6, { message: '密码长度不能少于6位' })
  @MaxLength(20, { message: '密码长度不能超过20位' })
  password: string;
}
