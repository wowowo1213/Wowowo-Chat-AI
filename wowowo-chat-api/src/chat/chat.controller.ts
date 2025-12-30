import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import { ChatService } from './chat.service';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  messages: Message[];
  systemPrompt?: string;
}

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('stream-sse')
  async streamChatSSE(@Body() body: ChatRequest, @Res() res: Response) {
    const messages = body.messages;
    try {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-store');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('Access-Control-Allow-Origin', '*');

      res.status(HttpStatus.OK);

      res.write('data: {"type": "start"}\n\n');

      for await (const content of this.chatService.streamChat(messages)) {
        const data = JSON.stringify({ type: 'chunk', content });
        res.write(`data: ${data}\n\n`);
      }

      res.write('data: {"type": "end"}\n\n');
      res.end();
    } catch (error) {
      const errorData = JSON.stringify({
        type: 'error',
        message: error.message,
      });
      res.write(`data: ${errorData}\n\n`);
      res.end();
    }
  }
}
