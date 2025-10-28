import { IsString, IsNotEmpty } from 'class-validator';

export class AppDto {
  @IsString({ message: 'username只能为字符串' })
  @IsNotEmpty({ message: '用户姓名不能为空' })
  username: string;

  @IsString({ message: 'pwd只能为字符串' })
  @IsNotEmpty({ message: '密码不能为空' })
  pwd: string;
}
