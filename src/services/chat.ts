import { useChatStore } from '@/stores/chat';
import type { ChatMessage } from '@/stores/chat';

export class ChatService {
  private controller: AbortController | null = null;
  private chatStore = useChatStore();

  async connectToStream(chat: ChatMessage[]) {
    this.disconnect();
    this.controller = new AbortController();

    try {
      const messages = chat.slice(-10); // 限制只能结合最后的上下10条信息回复，10条中包括ai的回复
      const response = await fetch(`${import.meta.env.VITE_API_URL}/chat/stream-sse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }), // 这边必须得用名字messages，不然后端内部会报错，获取不到post请求体中的messages
        signal: this.controller.signal,
      });

      if (!response.ok) throw new Error('请求失败');
      if (!response.body) throw new Error('无响应流');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));
            if (data.type === 'chunk') {
              this.chatStore.addDelta(data.content);
            } else if (data.type === 'end') {
              this.disconnect();
            } else if (data.type === 'error') {
              console.error('Stream error:', data.error);
              this.disconnect();
            }
          }
        }
      }
    } catch (error) {
      console.error('SSE 连接错误:', error);
      this.chatStore.addDelta('');
      this.disconnect();
    }
  }

  disconnect() {
    if (this.controller) {
      this.controller.abort();
      this.controller = null;
    }
  }
}

export const chatService = new ChatService();
