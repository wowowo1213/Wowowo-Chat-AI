import { defineStore } from 'pinia';

const DEFAULT_CHAT_NAME = '新对话';

export interface Attachment {
  name: string;
  size: number;
  type?: string;
  body?: string;
  note?: string;
}

export interface Message {
  role: string;
  content: string;
  attachments?: Attachment[];
  _key?: string; // 用于虚拟滚动唯一标识
}

interface ChatState {
  session: Record<string, Message[]>;
  curname: string;
  time: Record<string, number>;
}

export const useChatStore = defineStore('chat', {
  state: (): ChatState => {
    return {
      session: { [DEFAULT_CHAT_NAME]: [] }, // session 用来保存多个对话历史记录，一个对话历史记录Chat为数组，chat即为messages，该数组中包含多个问答message，每个对话历史记录chat都有不同的 curname
      curname: DEFAULT_CHAT_NAME, // 当前选中的对话历史记录的名称
      time: {}, // 用来保存每个对话chat最近一次的更新的时间
    };
  },
  actions: {
    clearSession() {
      this.session = {};
      this.curname = DEFAULT_CHAT_NAME;
      this.time = {};
    },

    getAllChats() {
      return Object.keys(this.session);
    },

    getNewDefaultChatName() {
      const base = DEFAULT_CHAT_NAME;
      if (!this.session[base]) {
        return base;
      }

      let index = 1;
      let candidate = `${base} ${index}`;
      while (this.session[candidate]) {
        index += 1;
        candidate = `${base} ${index}`;
      }
      return candidate;
    },

    generateNewChat(name: string) {
      this.session[name] = [];
      this.curname = name;
      this.time[name] = Date.now();
    },

    updateChatName(newName: string) {
      const trimmed = newName?.trim();
      if (!trimmed) {
        alert('标题名字不能为空！');
        return;
      }

      const currentName = this.curname;
      if (trimmed === currentName) {
        alert('前后对话标题一样！');
        return;
      }

      if (this.session[trimmed]) {
        alert('已有此标题！');
        return;
      }

      if (this.session[currentName]) {
        this.session[trimmed] = this.session[currentName];
        this.curname = trimmed; // 使用currentName指向了，所以不用担心curname的变换会丢失原先的指向，主要我有强迫症，更改顺序尽量保持和初始一样
        this.time[trimmed] = Date.now();
      } else {
        throw new Error('currentName在chatStore中的存储有问题！');
      }

      delete this.session[currentName];
      delete this.time[currentName];
    },

    selectChat(name: string) {
      if (name && this.curname !== name) {
        this.curname = name;
      }
    },

    deleteChat(name: string) {
      if (name === this.curname) {
        // 这边跳转到HomeView.vue;
        this.curname = DEFAULT_CHAT_NAME;
      }
      delete this.session[name];
      delete this.time[name];
    },

    chatPushMessage(msg: Message) {
      const key = this.curname;
      const message: Message = {
        role: msg.role,
        content: msg.content,
        attachments: msg.attachments || [],
      };

      if (!this.session[key]) {
        this.session[key] = [];
      }

      this.session[key].push(message);
      this.time[key] = Date.now();
    },

    getCurrentMessages() {
      const currentMessages = this.session[this.curname] || [];

      return currentMessages.map((item, index) => ({
        ...item,
        attachments: Array.isArray(item.attachments) ? item.attachments : [],
        _key: `${item.role}-${index}`, // _key用来进行虚拟列表的渲染，同一个messages中必须唯一
      }));
    },

    addDelta(delta: string) {
      const key = this.curname;
      const chat = this.session[key];
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

          this.time[key] = Date.now();
        }
      }
    },
  },
  persist: true,
});
