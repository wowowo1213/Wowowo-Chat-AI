<template>
  <pre><code v-html="highlightedCode" /></pre>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

const props = defineProps({ code: String, lang: String });

const highlightedCode = computed(() => {
  if (!props.code) return '';
  if (props.lang && hljs.getLanguage(props.lang)) {
    return hljs.highlight(props.code, { language: props.lang }).value;
  }
  return props.code;
});
</script>
