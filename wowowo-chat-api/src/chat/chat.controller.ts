import { Controller, Post, Body, Res } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatMessageDto } from './chat.dto';
import type { Response } from 'express';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('completion')
  async chatCompletion(@Body() body: ChatMessageDto, @Res() res: Response) {
    try {
      const stream = await this.chatService.chatCompletion(body.chatMessage);

      res.setHeader('Content-Type', 'text/event-stream');

      stream.pipe(res);

      stream.on('end', () => {
        res.end();
      });

      stream.on('error', (err) => {
        res.status(500).json({ error: err.message });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
