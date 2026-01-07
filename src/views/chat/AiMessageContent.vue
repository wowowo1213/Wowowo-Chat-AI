<template>
  <div v-html="parsedContent" />
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue';
import MarkdownIt from 'markdown-it';
import { markdownItTable } from 'markdown-it-table';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

const props = defineProps<{ source: string }>();
const parsedContent = ref('');

const addCopyButtons = () => {
  nextTick(() => {
    const tipBlocks = document.querySelectorAll('.ai_message_content_tip');
    tipBlocks.forEach((block) => {
      if (block.querySelector('.ai_message_content_tip_button')) return;

      const button = document.createElement('button');
      button.className =
        'ai_message_content_tip_button text-gray-100 bg-gray-800 rounded-xl px-2 py-1 cursor-pointer';
      button.textContent = '复制';

      button.addEventListener('click', () => {
        const preElement = block.closest('pre');
        const code = preElement?.querySelector('code')?.textContent ?? '';

        navigator.clipboard
          .writeText(code)
          .then(() => {
            button.textContent = '已复制!';
            setTimeout(() => {
              button.textContent = '复制';
            }, 2000);
          })
          .catch((err) => {
            console.error('复制失败：', err);
            button.textContent = '复制失败';
            setTimeout(() => {
              button.textContent = '复制';
            }, 2000);
          });
      });

      block.appendChild(button);
    });
  });
};

onMounted(() => {
  addCopyButtons();
});

const md = new MarkdownIt({
  html: true,
  linkify: true,
  breaks: true,
  typographer: true,
});

md.use(markdownItTable);

md.options.highlight = (str, lang) => {
  if (lang && hljs.getLanguage(lang)) {
    const highlighted = hljs.highlight(str, { language: lang }).value;
    return `<pre class="bg-black rounded-lg p-4 my-6 overflow-x-auto"><div class="flex justify-between mb-2 ai_message_content_tip"><span class="text-gray-100">${lang}</span></div><code class="text-white">${highlighted}</code></pre>`;
  }
  return `<pre class="bg-black my-6 p-4 overflow-x-auto"><code class="text-white">${md.utils.escapeHtml(str)}</code></pre>`;
};

md.renderer.rules = {
  ...md.renderer.rules,

  hr: () => '<hr class="my-8 border-gray-200 dark:border-black transition-all duration-200">',

  heading_open: (tokens, idx) => {
    const token = tokens[idx];
    if (!token) return '<p>渲染出错!!!</p>';
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
    '<ul class="my-3 text-gray-700 dark:text-gray-300 space-y-3 transition-all duration-200">',
  ordered_list_open: () =>
    '<ol class="mb-6 text-gray-700 dark:text-gray-300 space-y-3 transition-all duration-200">',
  list_item_open: () => '<li class="ml-4">',

  link_open: (tokens, idx) => {
    const token = tokens[idx];
    if (!token) return '<p>渲染出错!!!</p>';
    token.attrPush([
      'class',
      'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline transition-all duration-200',
    ]);
    return md.renderer.renderToken(tokens, idx, md.options);
  },

  code_inline: (tokens, idx) => {
    const token = tokens[idx];
    if (!token) return '<p>渲染出错!!!</p>';
    return `<code class="bg-black text-white rounded-sm px-2 py-1 border border-gray-500 text-sm transition-all duration-200">${md.utils.escapeHtml(token.content)}</code>`;
  },

  blockquote_open: () => {
    return '<blockquote class="border-l-4 border-gray-300 dark:border-gray-500 pl-4 py-2 mb-6 italic transition-all duration-200">';
  },

  table_open: () => '<table class="w-full border-collapse overflow-x-auto my-4">',
  table_close: () => '</table>',
  thead_open: () => '<thead class="bg-gray-100 dark:bg-gray-800 transition-colors duration-200">',
  thead_close: () => '</thead>',
  tbody_open: () => '<tbody>',
  tbody_close: () => '</tbody>',
  tr_open: () =>
    `<tr class="${'border-b border-gray-200 dark:border-gray-600 transition-colors duration-200'}">`,
  tr_close: () => '</tr>',
  th_open: () =>
    '<th class="px-4 py-2 text-left font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200">',
  th_close: () => '</th>',
  td_open: () =>
    '<td class="px-4 py-2 text-gray-700 dark:text-gray-300 transition-colors duration-200">',
  td_close: () => '</td>',
};

watch(
  () => props.source,
  (newVal) => {
    if (!newVal) return;
    parsedContent.value = md.render(newVal);
  },
  { immediate: true }
);
</script>
