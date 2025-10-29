import { Module } from '@nestjs/common';
import { UserinfoModule } from './userinfo/userinfo.module';
import { ChatModule } from './chat/chat.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UserinfoModule,
    ChatModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
