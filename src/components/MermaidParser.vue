<template>
  <div ref="container" />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import mermaid from 'mermaid';

const props = defineProps<{ code: string }>();
const container = ref<HTMLElement | null>(null);

onMounted(async () => {
  if (!container.value || !props.code) return;

  try {
    mermaid.initialize({
      startOnLoad: false,
    });

    const containerId = `mermaid-${Date.now()}`;
    container.value.id = containerId;
    const { svg } = await mermaid.render(containerId, props.code);

    container.value.replaceChildren();
    container.value.insertAdjacentHTML('beforeend', svg);
  } catch (error) {
    console.error('Mermaid render error:', error);
    if (container.value) container.value = null;
  }
});

onUnmounted(() => {
  if (container.value) container.value = null;
});
</script>
