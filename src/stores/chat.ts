import { defineStore } from 'pinia';
import { ref } from 'vue';

const DEFAULT_CHAT_NAME = '新对话';

export interface ContentItem {
  type: 'text';
  text?: string;
}

export interface Attachment {
  name: string;
  size: number;
  type: string;
  text?: string;
  imgurl?: string;
  previewURL?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: ContentItem[];
  attachments?: Attachment[];
  _key?: string;
}

export const useChatStore = defineStore(
  'chat',
  () => {
    const session = ref<Record<string, ChatMessage[]>>({ [DEFAULT_CHAT_NAME]: [] });
    const curname = ref(DEFAULT_CHAT_NAME);
    const time = ref<Record<string, number>>({});

    function resetChatStore() {
      session.value = {};
      curname.value = DEFAULT_CHAT_NAME;
      time.value = {};
    }

    function getAllChats(): string[] {
      return Object.keys(session.value).sort((a, b) => time.value[b]! - time.value[a]!);
    }

    function getChatTime(name: string): number {
      return time.value[name] || 0;
    }

    function getNewDefaultChatName() {
      const base = DEFAULT_CHAT_NAME;
      if (!session.value[base]) return base;

      let index = 1;
      let candidate = `${base} ${index}`;
      while (session.value[candidate]) {
        index += 1;
        candidate = `${base} ${index}`;
      }
      return candidate;
    }

    function generateNewChat(name: string) {
      session.value[name] = [];
      curname.value = name;
      time.value[name] = Date.now();
    }

    function updateChatName(oldName: string, newName: string) {
      const trimmed = newName?.trim();
      if (!session.value[oldName]) throw new Error('当前对话不存在!');
      if (!trimmed) return alert('对话标题不能为空！');
      if (trimmed === oldName) return alert('前后对话标题一样！');
      if (session.value[trimmed]) return alert('已有此标题！');
      if (trimmed.length > 15) return alert('标题名称不能超过15个字符');

      session.value[trimmed] = session.value[oldName];
      time.value[trimmed] = Date.now();

      delete session.value[oldName];
      delete time.value[oldName];
    }

    function changeChat(chatName: string) {
      curname.value = chatName;
    }

    function deleteChat(name: string) {
      delete session.value[name];
      delete time.value[name];

      if (name === curname.value) curname.value = DEFAULT_CHAT_NAME;
    }

    function chatPushMessage(msg: ChatMessage) {
      const key = curname.value;
      const message: ChatMessage = {
        role: msg.role,
        content: msg.content,
        attachments: msg.attachments || [],
      };

      if (!session.value[key]) session.value[key] = [];

      session.value[key].push(message);
      time.value[key] = Date.now();
    }

    function getCurrentMessages() {
      const currentMessages = session.value[curname.value] || [];
      return currentMessages.map((item, index) => ({
        ...item,
        attachments: item.attachments || [],
        _key: `${item.role}-${index}`,
      }));
    }

    function addDelta(delta: string) {
      const curChat = session.value[curname.value] || [];
      if (curChat.length > 0 && curChat[curChat.length - 1]?.role !== 'assistant') {
        curChat.push({
          role: 'assistant',
          content: [
            {
              type: 'text',
              text: delta,
            },
          ],
        });
      } else {
        const lastMessage = curChat[curChat.length - 1];
        const curContent = lastMessage?.content[0];
        if (!lastMessage || !curContent) return;
        curContent.text += delta;
      }
    }

    return {
      session,
      curname,
      time,
      resetChatStore,
      getAllChats,
      getChatTime,
      getNewDefaultChatName,
      generateNewChat,
      updateChatName,
      changeChat,
      deleteChat,
      chatPushMessage,
      getCurrentMessages,
      addDelta,
    };
  },
  {
    persist: true,
  }
);
