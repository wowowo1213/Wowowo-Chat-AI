import { IsArray, ArrayMinSize } from 'class-validator';

export class ChatMessageDto {
  @IsArray({ message: 'chatMessage类型必须为数组' })
  @ArrayMinSize(1, { message: 'chatMessage数组不能为空' })
  chatMessage: string[];
}
