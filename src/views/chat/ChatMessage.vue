<template>
  <div class="flex-1 overflow-y-auto">
    <DynamicScroller
      class="h-full w-full"
      :items="messages"
      :min-item-size="100"
      :key="chatStore.curname"
      key-field="_key"
      style="scrollbar-width: none"
    >
      <template #default="{ item, index, active }">
        <DynamicScrollerItem :item="item" :active="active" :data-index="index">
          <div :class="item.role === 'user' ? 'flex justify-end pr-40 pb-6' : 'px-40 pb-6'">
            <div
              v-if="item.role === 'user'"
              class="dark:text-white bg-gray-100 dark:bg-gray-800 rounded-lg py-4 px-6 transition-all duration-200 max-w-[60%]"
            >
              <p>
                {{ item.content }}
              </p>

              <div v-if="item.attachments && item.attachments.length > 0" class="mt-4">
                <div
                  v-for="(attachment, index) in item.attachments"
                  :key="index"
                  class="mt-2 inline-flex items-center space-x-3 rounded-lg bg-white dark:bg-gray-700 p-2 transition-all duration-200"
                >
                  <img :src="getFileIcon(attachment.type)" alt="文件图标" class="w-8 h-8" />
                  <div class="flex flex-col">
                    <span
                      class="text-sm text-gray-800 dark:text-gray-300 transition-all duration-200"
                    >
                      {{ attachment.name }}
                    </span>
                    <span
                      class="text-xs text-gray-500 dark:text-gray-400 transition-all duration-200"
                    >
                      {{ formatFileSize(attachment.size) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-else
              class="bg-blue-50 dark:text-white dark:bg-gray-700 rounded-lg py-4 px-6 transition-all duration-200"
            >
              <p class="mt-3 text-gray-600 dark:text-gray-400 pb-4 transition-all duration-200">
                回答来自 通义千问-plus 大模型
              </p>
              <p v-if="item.content" class="mb-3" v-html="renderMarkdown(item.content)"></p>
              <p v-else class="mb-3">网络出错啦，芙宁娜暂时无法回答您的问题🌹</p>
            </div>
          </div>
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useChatStore } from '@/stores/chat';
import type { Attachment } from '@/stores/chat';
import pdfIcon from '@/assets/pdf.jpg';
import docIcon from '@/assets/doc.jpg';
import imageIcon from '@/assets/logo.jpg';
import defaultIcon from '@/assets/default.jpg';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

const chatStore = useChatStore();
const messages = computed(() => chatStore.getCurrentMessages());

const getFileIcon = (type?: string) => {
  if (!type) return defaultIcon;
  if (type.includes('pdf')) return pdfIcon;
  if (type.includes('image')) return imageIcon;
  if (type.includes('word') || type.includes('doc')) return docIcon;
  return defaultIcon;
};

const formatFileSize = (size: number): string => {
  if (size < 1024) return `${size}B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)}KB`;
  return `${(size / (1024 * 1024)).toFixed(1)}MB`;
};

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

interface MarkdownItRenderer {
  rules: Record<string, (tokens: any[], idx: number) => string>;
  renderToken: (tokens: any[], idx: number, options: any) => string;
}

interface MarkdownItUtils {
  escapeHtml: (str: string) => string;
}

interface MarkdownItWithHighlight extends MarkdownIt {
  options: {
    highlight?: (str: string, lang: string) => string;
  };
  renderer: MarkdownItRenderer;
  utils: MarkdownItUtils;
  render: (src: string, env?: any) => string;
}

const md = (() => {
  const markdownIt = new MarkdownIt({
    html: true,
    linkify: true,
    breaks: true,
    typographer: true,
  }) as MarkdownItWithHighlight;

  markdownIt.options.highlight = (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        const highlighted = hljs.highlight(str, { language: lang }).value;
        return `<pre class="hljs rounded-lg p-4 mb-6 overflow-x-auto bg-gray-50 dark:bg-gray-800 transition-all duration-200"><code>${highlighted}</code></pre>`;
      } catch (e) {
        console.warn('Failed to highlight code:', e);
      }
    }
    return `<pre class="hljs mb-6 p-4"><code>${markdownIt.utils.escapeHtml(str)}</code></pre>`;
  };

  markdownIt.renderer.rules = {
    ...markdownIt.renderer.rules,
    hr: () => '<hr class="my-8 border-gray-200 dark:border-black transition-all duration-200">',

    paragraph: (tokens, idx) => {
      return `<p class="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed transition-all duration-200">${tokens[idx].content}</p>`;
    },

    heading_open: (tokens, idx) => {
      const token = tokens[idx];
      const level = parseInt(token.tag.slice(1), 10);
      const classes =
        {
          1: 'text-3xl font-bold mb-6 text-black-900 dark:text-white transition-all duration-200',
          2: 'text-2xl font-bold mb-5 text-black-800 dark:text-gray-100 transition-all duration-200',
          3: 'text-xl font-bold mb-4 text-black-700 dark:text-gray-200 transition-all duration-200',
          4: 'text-lg font-bold mb-3 text-black-600 dark:text-gray-300 transition-all duration-200',
        }[level] || '';
      return `<${token.tag} class="${classes}">`;
    },

    bullet_list_open: () =>
      '<ul class="list-disc list-inside mb-6 text-gray-700 dark:text-gray-300 space-y-3 transition-all duration-200">',
    ordered_list_open: () =>
      '<ol class="list-decimal list-inside mb-6 text-gray-700 dark:text-gray-300 space-y-3 transition-all duration-200">',
    list_item_open: () => '<li class="ml-4">',

    link_open: (tokens, idx) => {
      const token = tokens[idx];
      token.attrPush([
        'class',
        'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline transition-all duration-200',
      ]);
      return markdownIt.renderer.renderToken(tokens, idx, markdownIt.options);
    },

    code_inline: (tokens, idx) => {
      return `<code class="bg-black text-white rounded px-2 py-1 text-sm mx-1 transition-all duration-200">${markdownIt.utils.escapeHtml(tokens[idx].content)}</code>`;
    },

    blockquote_open: () =>
      '<blockquote class="border-l-4 border-gray-300 dark:border-gray-600 pl-4 py-2 mb-6 italic transition-all duration-200">',
  };

  return markdownIt;
})();

const renderMarkdown = (text: string) => {
  return md.render(text);
};
</script>
