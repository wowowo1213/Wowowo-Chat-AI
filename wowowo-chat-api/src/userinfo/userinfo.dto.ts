import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class LoginUserDto {
  @IsString({ message: '手机号只能是为字符串类型' })
  @IsNotEmpty({ message: '手机号不能为空' })
  @Matches(/^1[3-9]\d{9}$/, { message: '请填写正确的手机号' })
  phoneNumber: string;

  @IsString({ message: 'password只能为字符串类型' })
  @IsNotEmpty({ message: '密码不能为空' })
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d).{6,20}$/, {
    message: '密码需包含字母和数字且长度为6-20位',
  })
  password: string;
}

export class RegisterUserDto extends LoginUserDto {
  @IsString({ message: 'confirmPassword只能为字符串类型' })
  @IsNotEmpty({ message: '请填写确认密码' })
  confirmPassword: string;
}
