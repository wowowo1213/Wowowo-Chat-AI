<template>
  <div class="markdown-renderer">
    <component :is="{ render: () => parsedContent }" />
  </div>
</template>

<script setup lang="ts">
import { h, computed } from 'vue';
import { marked } from 'marked';

const props = defineProps({
  source: {
    type: String,
    required: true,
  },
});

const renderer = new marked.Renderer();
renderer.heading = (text, level) => h(`h${level}`, { class: `heading-${level}` }, text);

marked.setOptions({
  renderer,
  gfm: true,
  breaks: true,
});

const parsedContent = computed(() => {
  const html = marked.parse(props.source);
  return h('div', { innerHTML: html });
});
</script>
