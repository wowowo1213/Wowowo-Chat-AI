import { defineStore } from 'pinia';

const DEFAULT_CHAT_NAME = '新对话';

const formatFileSize = (size: number): string => {
  if (size < 1024) return `${size}B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)}KB`;
  return `${(size / (1024 * 1024)).toFixed(1)}MB`;
};

interface Attachment {
  name: string;
  size: number;
  type?: string;
  body?: string;
  note?: string;
}

const describeAttachment = (attachment?: Attachment): string => {
  if (!attachment) return '';
  const { name, size, type, body, note } = attachment;
  const header = [`文件名: ${name}`, `大小: ${formatFileSize(size)}`];
  if (type) {
    header.push(`类型: ${type}`);
  }

  const bodyText = body ? `内容预览:\n${body.slice(0, 4000)}` : note || '未提供内容';

  return `${header.join(' | ')}\n${bodyText}`;
};

interface Message {
  role: string;
  content: string;
  attachments?: Attachment[];
  _key?: string; // 用于虚拟滚动唯一标识
}

interface ChatState {
  session: Record<string, Message[]>;
  curname: string;
  time: Record<string, number>;
  reason: Record<string, string[]>;
  showReason: Record<string, boolean[]>;
}

export const useChatStore = defineStore('chat', {
  state: (): ChatState => {
    return {
      session: { [DEFAULT_CHAT_NAME]: [] }, // session 用来保存多个对话历史记录，一个对话历史记录Chat为数组，该数组中包含多个问答message，每个对话历史记录都有不同的 curname
      curname: DEFAULT_CHAT_NAME, // 当前选中的对话历史记录的名称
      time: {}, // 用来保存每个对话chat最近一次的更新的时间，使用每个Chat的curname来读取
      reason: { [DEFAULT_CHAT_NAME]: [] }, // 用于存储 AI 思考过程的中间结果
      showReason: { [DEFAULT_CHAT_NAME]: [] }, // 控制每条推理信息是否展开显示
    };
  },
  actions: {
    clearSession() {
      this.session = {};
      this.curname = DEFAULT_CHAT_NAME;
      this.time = {};
      this.reason = {};
      this.showReason = {};
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
      this.reason[name] = [];
      this.showReason[name] = [];
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

      if (this.session[currentName] && this.reason[currentName] && this.showReason[currentName]) {
        this.session[trimmed] = this.session[currentName];
        this.curname = trimmed; // 使用currentName指向了，所以不用担心curname的变换会丢失原先的指向，主要我有强迫症，更改顺序尽量保持和初始一样
        this.time[trimmed] = Date.now();
        this.reason[trimmed] = this.reason[currentName];
        this.showReason[trimmed] = this.showReason[currentName];
      } else {
        throw new Error('currentName在chat.ts的存储有问题！');
      }

      delete this.session[currentName];
      delete this.time[currentName];
      delete this.reason[currentName];
      delete this.showReason[currentName];
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
      delete this.reason[name];
      delete this.showReason[name];
    },

    chatPushMessage(msg: Message) {
      const key = this.curname;
      if (msg.content) {
        const message: Message = {
          role: msg.role,
          content: msg.content,
          attachments: msg.attachments || [],
        };
        this.session[key]?.push(message);
        this.time[key] = Date.now();
      }
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
        const lastMessage = chat[chat.length - 1];
        if (lastMessage) {
          lastMessage.content += delta;
        }
      }
    },

    reasonPush(delta: string) {
      const key = this.curname;
      const reasoningList = this.reason[key];
      if (reasoningList) {
        const last = reasoningList[reasoningList.length - 1];
        if (last !== undefined) {
          reasoningList[reasoningList.length - 1] = `${last}${delta}`;
        }
      }
    },
  },
  persist: true,
});
