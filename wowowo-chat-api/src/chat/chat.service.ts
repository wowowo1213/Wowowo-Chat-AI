import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class ChatService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.DASHSCOPE_API_KEY,
      baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    });
  }

  async *streamChat(messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]) {
    try {
      const stream = await this.openai.chat.completions.create({
        model: 'qwen-plus',
        messages: [...messages],
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          yield content;
        }
      }
    } catch (error) {
      console.error('AI服务错误：', error);
      throw new Error('AI服务调用失败');
    }
  }
}
