<template>
  <div ref="container" v-html="partialContent" />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

const props = defineProps<{ source: string }>();
const container = ref<HTMLElement | null>(null);
const partialContent = ref('');
const isRendering = ref(false);

const md = new MarkdownIt({
  html: true,
  linkify: true,
  breaks: true,
  typographer: true,
});

md.options.highlight = (str, lang) => {
  if (lang && hljs.getLanguage(lang)) {
    try {
      const highlighted = hljs.highlight(str, { language: lang }).value;
      return `<pre class="hljs rounded-lg p-4 mb-6 overflow-x-auto bg-gray-50 dark:bg-gray-800 transition-all duration-200"><code>${highlighted}</code></pre>`;
    } catch (e) {
      console.warn('Failed to highlight code:', e);
    }
  }
  return `<pre class="hljs mb-6 p-4 overflow-x-auto"><code>${md.utils.escapeHtml(str)}</code></pre>`;
};

md.renderer.rules = {
  ...md.renderer.rules,
  hr: () => '<hr class="my-8 border-gray-200 dark:border-black transition-all duration-200">',

  paragraph: (tokens, idx) => {
    const token = tokens[idx];
    if (!token) return '<p>渲染出错!!!</p>';
    return `<p class="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed transition-all duration-200">${token.content}</p>`;
  },

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
    '<ul class="list-disc list-inside mb-6 text-gray-700 dark:text-gray-300 space-y-3 transition-all duration-200">',
  ordered_list_open: () =>
    '<ol class="list-decimal list-inside mb-6 text-gray-700 dark:text-gray-300 space-y-3 transition-all duration-200">',
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
    return `<code class="bg-black text-white rounded px-2 py-1 text-sm mx-1 transition-all duration-200">${md.utils.escapeHtml(token.content)}</code>`;
  },

  blockquote_open: () => {
    return '<blockquote class="border-l-4 border-gray-300 dark:border-gray-600 pl-4 py-2 mb-6 italic transition-all duration-200">';
  },
};

const splitMarkdownIntoChunks = (text: string): string[] => {
  return text.split(/(?:\r?\n){2,}/).filter((chunk) => chunk.trim());
};

const renderInChunks = (text: string) => {
  const chunks = splitMarkdownIntoChunks(text);
  let index = 0;
  isRendering.value = true;

  const renderNextChunk = () => {
    if (index < chunks.length) {
      const chunk = chunks[index];
      if (!chunk) return;
      partialContent.value += md.render(chunk);
      index++;
      requestAnimationFrame(renderNextChunk);
    } else {
      isRendering.value = false;
    }
  };

  partialContent.value = '';
  renderNextChunk();
};

watch(
  () => props.source,
  (newVal) => {
    if (newVal && !isRendering.value) renderInChunks(newVal);
  },
  { immediate: true }
);
</script>
