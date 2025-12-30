import { defineStore } from 'pinia';
import { ref } from 'vue';

const DEFAULT_CHAT_NAME = '新对话';

export interface Attachment {
  name: string;
  size: number;
  type?: string;
  body?: string;
  note?: string;
}

export interface ChatMessage {
  role: string;
  content: string;
  attachments?: Attachment[];
  _key?: string;
}

export const useChatStore = defineStore(
  'chat',
  () => {
    const session = ref<Record<string, ChatMessage[]>>({ [DEFAULT_CHAT_NAME]: [] });
    const curname = ref(DEFAULT_CHAT_NAME);
    const time = ref<Record<string, number>>({});

    function clearChatStore() {
      session.value = {};
      curname.value = DEFAULT_CHAT_NAME;
      time.value = {};
    }

    function getAllChats() {
      return Object.keys(session.value).sort((a, b) => time.value[b] - time.value[a]);
    }

    function getTime(name: string): number {
      return time.value[name] || 0;
    }

    function getNewDefaultChatName() {
      const base = DEFAULT_CHAT_NAME;
      if (!session.value[base]) {
        return base;
      }

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
      if (!trimmed) {
        alert('标题名字不能为空！');
        return;
      }

      if (trimmed === oldName) {
        alert('前后对话标题一样！');
        return;
      }

      if (session.value[trimmed]) {
        alert('已有此标题！');
        return;
      }

      if (trimmed.length > 15) {
        alert('标题名称不能超过15个字符');
        return;
      }

      if (session.value[oldName]) {
        session.value[trimmed] = session.value[oldName];
        time.value[trimmed] = Date.now();
      } else {
        throw new Error('currentName在chatStore中的存储有问题！');
      }

      delete session.value[oldName];
      delete time.value[oldName];
    }

    function selectChat(name: string) {
      if (name && curname.value !== name) {
        // 修复拼写错误：curnam.valuee → curname.value
        curname.value = name;
      }
    }

    function deleteChat(name: string) {
      if (name === curname.value) {
        curname.value = DEFAULT_CHAT_NAME;
      }
      delete session.value[name];
      delete time.value[name];
    }

    function chatPushMessage(msg: ChatMessage) {
      const key = curname.value;
      const message: ChatMessage = {
        role: msg.role,
        content: msg.content,
        attachments: msg.attachments || [],
      };

      if (!session.value[key]) {
        session.value[key] = [];
      }

      session.value[key].push(message);
      time.value[key] = Date.now();
    }

    function getCurrentMessages() {
      const currentMessages = session.value[curname.value] || [];
      return currentMessages.map((item, index) => ({
        ...item,
        attachments: Array.isArray(item.attachments) ? item.attachments : [],
        _key: `${item.role}-${index}`,
      }));
    }

    function addDelta(delta: string) {
      const key = curname.value; // 修复：curname → curname.value
      const chat = session.value[key];
      if (chat) {
        if (chat[chat.length - 1]!.role !== 'assistant') {
          chat.push({
            role: 'assistant',
            content: delta,
            attachments: [],
          });
        } else {
          const lastMessage = chat[chat.length - 1];
          lastMessage!.content += delta;
          time.value[key] = Date.now();
        }
      }
    }

    return {
      session,
      curname,
      time,
      clearChatStore,
      getAllChats,
      getTime,
      getNewDefaultChatName,
      generateNewChat,
      updateChatName,
      selectChat,
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
