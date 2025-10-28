import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  loginUser(username: string, pwd: string) {
    return {
      message: '数据处理成功',
    };
  }
}
