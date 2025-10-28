import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  loginUser(username: string, pwd: string) {
    // throw new Error('数据库操作出错');
    return '数据处理成功';
  }
}
