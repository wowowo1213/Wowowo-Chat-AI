import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { useUserStore } from './user';

interface ChatMessage {
  message: string;
  reply: string;
  createdAt: string;
}

type FormattedMessage = {
  role: 'user' | 'ai' | 'system';
  content: string;
  format?: 'text' | 'markdown';
  createdAt?: string;
};

export const useChatStore = defineStore('chat', () => {
  const messages = ref<FormattedMessage[]>([]);
  const isLoading = ref(false);
  const userStore = useUserStore();

  const loadChatHistory = async () => {
    if (!userStore.userId) return;

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/get-messages`, {
        userId: userStore.userId,
      });

      if (!data.messages) return;

      messages.value = data.messages
        .sort(
          (a: ChatMessage, b: ChatMessage) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        )
        .flatMap((msg: ChatMessage) => [
          {
            role: 'user' as const,
            content: msg.message,
            format: 'text',
            createdAt: msg.createdAt,
          },
          {
            role: 'ai' as const,
            content: msg.reply || '等待回复中...',
            format: 'markdown',
            createdAt: msg.createdAt,
          },
        ]);
    } catch (error) {
      console.error('加载历史消息失败', error);
      messages.value.push({
        role: 'system' as const,
        content: '**历史消息加载失败**，请检查网络后重试',
        format: 'markdown',
      });
    }
  };

  const sendMessage = async (message: string) => {
    if (!message.trim() || !userStore.userId || isLoading.value) return;

    const userMessage: FormattedMessage = {
      role: 'user',
      content: message,
      format: 'text',
      createdAt: new Date().toISOString(),
    };
    messages.value.push(userMessage);
    isLoading.value = true;

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/chat`, {
        message,
        userId: userStore.userId,
        history: messages.value.filter((msg) => msg.role === 'user' || msg.role === 'ai'),
      });

      const aiMessage: FormattedMessage = {
        role: 'ai',
        content: data.reply || '**抱歉**，我没理解你的意思 😅',
        format: 'markdown',
        createdAt: new Date().toISOString(),
      };
      messages.value.push(aiMessage);
    } catch (error) {
      messages.value.push({
        role: 'system',
        content: '**消息发送失败** 📡\n请检查网络后重试',
        format: 'markdown',
      });
    } finally {
      isLoading.value = false;
    }
  };

  return { messages, isLoading, loadChatHistory, sendMessage };
});
