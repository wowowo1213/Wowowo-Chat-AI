import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import { ChatService } from './chat.service';

interface ImageUrlContent {
  type: 'image_url';
  image_url: {
    url: string;
  };
}

interface TextContent {
  type: 'text';
  text: string;
}

type ContentItem = ImageUrlContent | TextContent;

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: ContentItem[];
}

interface ChatRequest {
  messages: Message[];
}

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('stream-sse')
  async streamChatSSE(@Body() body: ChatRequest, @Res() res: Response) {
    const adaptedMessages = body.messages.map((msg) => {
      return {
        role: msg.role,
        content: JSON.stringify(msg.content),
      };
    });

    try {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-store');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('Access-Control-Allow-Origin', '*');

      res.status(HttpStatus.OK);

      res.write('data: {"type": "start"}\n\n');

      for await (const content of this.chatService.streamChat(adaptedMessages)) {
        const data = JSON.stringify({ type: 'chunk', content });
        res.write(`data: ${data}\n\n`);
      }

      res.write('data: {"type": "end"}\n\n');
      res.end();
    } catch (error) {
      const errorData = JSON.stringify({
        type: 'error',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      res.write(`data: ${errorData}\n\n`);
      res.end();
    }
  }
}
