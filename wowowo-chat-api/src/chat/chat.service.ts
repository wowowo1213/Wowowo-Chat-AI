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

  async *streamChat(messages) {
    try {
      const stream = await this.openai.chat.completions.create({
        model: 'qwen3-vl-plus',
        messages,
        stream: true,
        response_format: {
          type: 'text',
        },
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        yield content;
      }
    } catch (error) {
      throw new Error(`AI服务调用失败: ${error}`);
    }
  }
}
