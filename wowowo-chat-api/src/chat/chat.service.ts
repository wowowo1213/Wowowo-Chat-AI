import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { Readable } from 'stream';

@Injectable()
export class ChatService {
  private readonly openai: OpenAI;

  constructor() {
    if (!process.env.DASHSCOPE_API_KEY) {
      throw new Error('请设置环境变量 DASHSCOPE_API_KEY');
    }

    this.openai = new OpenAI({
      apiKey: process.env.DASHSCOPE_API_KEY,
      baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    });
  }

  async chatCompletion(messages: string[]) {
    try {
      const chatMessages = messages.map((content) => ({
        role: 'user' as const,
        content,
      }));

      const response = await this.openai.chat.completions.create({
        model: 'qwen-plus',
        messages: [
          {
            role: 'system',
            content:
              '你的名字叫做芙宁娜，上知天文下知地理，能解答各种问题，别人问你任何问题都要先说你是芙宁娜',
          },
          ...chatMessages,
        ],
        stream: true,
      });

      const stream = new Readable();
      stream._read = () => {};

      // 直接返回流，让控制器处理
      return new Promise<Readable>((resolve, reject) => {
        (async () => {
          try {
            for await (const chunk of response) {
              if (chunk.choices[0]?.delta?.content) {
                const content = chunk.choices[0].delta.content;
                stream.push(`data: ${JSON.stringify({ content })}\n\n`);
              }
            }
            stream.push('data: [DONE]\n\n');
            stream.push(null);
            resolve(stream);
          } catch (error) {
            stream.push(`data: ${JSON.stringify({ error: error.message })}\n\n`);
            stream.push(null);
            reject(error);
          }
        })();
      });
    } catch (error) {
      const errorStream = new Readable();
      errorStream._read = () => {};
      errorStream.push(`data: ${JSON.stringify({ error: `AI 调用失败: ${error.message}` })}\n\n`);
      errorStream.push(null);
      return Promise.resolve(errorStream);
    }
  }
}
