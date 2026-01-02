<template>
  <div
    class="prose max-w-full dark:text-gray-300 transition-colors duration-200"
    v-html="parsedContent"
  />
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const props = defineProps({
  source: {
    type: String,
    required: true,
  },
});

const parsedContent = ref('');

watchEffect(async () => {
  const html = await marked.parse(props.source);
  parsedContent.value = DOMPurify.sanitize(html);
});
</script>
