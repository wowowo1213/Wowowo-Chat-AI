import { LoggerService } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export class MyLogger implements LoggerService {
  private logDir = path.resolve(__dirname, '../logs');

  constructor() {
    // 文件夹不存在的话就创建一个
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private writeLog(level: string, message: any) {
    const logFile = path.join(this.logDir, `${level}.log`);
    const logMsg = `[${new Date().toISOString()}]  ${message} \n`;

    fs.appendFile(logFile, logMsg, (err) => {
      if (err) {
        console.error('写日志失败', err);
      }
    });
  }

  // 一般日志
  log(message: any) {
    console.log('[LOG]', message);
    this.writeLog('log', message);
  }

  // 错误日志
  error(message: any, trace?: string) {
    console.error('[错误日志输出]', message, trace ? `\n${trace}` : '');
    this.writeLog('error', ` ${message}${trace ? `\n${trace}}` : ''}`);
  }

  // 警告日志
  warn(message: any) {
    console.warn('[WARN]', message);
    this.writeLog('warn', message);
  }
}
