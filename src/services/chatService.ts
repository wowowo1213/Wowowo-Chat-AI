import { useChatStore } from '@/stores/chat';
import type { ChatMessage } from '@/stores/chat';

class ChatService {
  private controller: AbortController | null = null;
  private chatStore = useChatStore();

  async connectToStream(chatMessages: ChatMessage[]) {
    this.disconnect();
    this.controller = new AbortController();

    try {
      const messages = chatMessages.slice(-10);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/chat/stream-sse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
        signal: this.controller.signal,
      });

      if (!res.ok) throw new Error('请求失败');
      if (!res.body) throw new Error('无响应流');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n\n');

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = JSON.parse(line.slice(6));
          if (data.type === 'chunk') {
            this.chatStore.addDelta(data.content);
          } else if (data.type === 'end') {
            this.disconnect();
          } else if (data.type === 'error') {
            console.error('Stream error:', data.message);
            this.disconnect();
          }
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError')
        return console.log('SSE 连接已断开');

      console.error('SSE 连接错误:', error instanceof Error ? error.message : '未知错误');
      this.chatStore.addDelta('网络出错啦，暂时无法使用🌹');
      this.disconnect();
    }
  }

  disconnect() {
    if (!this.controller) return;
    this.controller.abort();
    this.controller = null;
  }
}

export const chatService = new ChatService();
