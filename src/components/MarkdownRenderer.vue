<template>
  <component :is="VNodeTree" v-if="VNodeTree" />
</template>

<script setup lang="ts">
import { h, ref, watch } from 'vue';
import type { VNode } from 'vue';
import type {
  Node as HastNode,
  Element as HastElement,
  Text as HastText,
  Root as HastRoot,
} from 'hast';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkGemoji from 'remark-gemoji';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import MermaidParser from './MermaidParser.vue';
import CodeParser from './CodeParser.vue';

const props = defineProps<{
  content: string;
}>();

const processor = unified()
  .use(remarkParse)
  .use(remarkBreaks)
  .use(remarkGfm, { singleTilde: false })
  .use(remarkMath)
  .use(remarkGemoji)
  .use(remarkRehype)
  .use(rehypeRaw)
  .use(rehypeSanitize, {
    tagNames: [
      'h1',
      'h2',
      'h3',
      'p',
      'br',
      'a',
      'img',
      'strong',
      'em',
      'code',
      'pre',
      'ul',
      'ol',
      'li',
      'div',
      'span',
    ],
    attributes: {
      '*': ['class'],
      a: ['href', 'target', 'rel'],
      img: ['src', 'alt'],
    },
  });

type HastToVNode = (node: HastNode | null | undefined) => VNode | null;

const hastToVNode: HastToVNode = (node) => {
  if (!node) return null;

  switch (node.type) {
    case 'root': {
      const root = node as HastRoot;
      return h(
        'div',
        { class: 'markdown-body' },
        root.children?.map((child) => hastToVNode(child))
      );
    }
    case 'element': {
      const element = node as HastElement;
      const { tagName, properties = {}, children = [] } = element;

      if (tagName === 'pre') {
        const codeNode = children.find(
          (child): child is HastElement => child.type === 'element' && child.tagName === 'code'
        );

        if (codeNode) {
          const firstChild = codeNode.children[0];
          const codeValue = firstChild?.type === 'text' ? firstChild.value : '';

          const classNames = Array.isArray(codeNode.properties?.className)
            ? codeNode.properties.className
            : typeof codeNode.properties?.className === 'string'
              ? [codeNode.properties.className]
              : [];

          if (classNames.includes('language-mermaid')) {
            return h(MermaidParser, { code: codeValue });
          }
          if (classNames.includes('language-math')) {
            return h('div', {
              class: 'math-block',
              innerHTML: katex.renderToString(codeValue, {
                displayMode: true,
                throwOnError: false,
              }),
            });
          }
          const lang =
            classNames
              .find((cls): cls is string => typeof cls === 'string' && cls.startsWith('language-'))
              ?.replace('language-', '') || '';
          return h(CodeParser, { code: codeValue, lang });
        }
      }

      if (tagName === 'code' && !properties.className) {
        return h(
          'code',
          {},
          children.map((child) => hastToVNode(child))
        );
      }

      if (
        tagName === 'code' &&
        ((Array.isArray(properties.className) && properties.className.includes('math-inline')) ||
          (typeof properties.className === 'string' &&
            properties.className.includes('math-inline')))
      ) {
        const mathValue = (children[0] as HastText)?.value || '';
        return h('span', {
          class: 'math-inline',
          innerHTML: katex.renderToString(mathValue, {
            displayMode: false,
            throwOnError: false,
          }),
        });
      }

      if (tagName === 'a') {
        return h(
          'a',
          {
            ...properties,
            target: '_blank',
            rel: 'noopener noreferrer',
          },
          children.map((child) => hastToVNode(child))
        );
      }

      return h(
        tagName,
        properties,
        children.map((child) => hastToVNode(child))
      );
    }
    case 'text': {
      const text = node as HastText;
      return h('span', text.value);
    }
    case 'comment': {
      const comment = node as HastText;
      return h('span', { class: 'comment' }, `<!-- ${comment.value} -->`);
    }
    default: {
      const defaultNode = node as HastNode & { children?: HastNode[]; properties?: object };
      return defaultNode.children
        ? h(
            'span',
            defaultNode.properties,
            defaultNode.children.map((child) => hastToVNode(child))
          )
        : null;
    }
  }
};

const VNodeTree = ref<VNode | null>(null);
watch(
  () => props.content,
  async (content) => {
    try {
      const hast = await processor.run(processor.parse(content));
      VNodeTree.value = hastToVNode(hast);
    } catch (error) {
      console.error('Markdown processing failed:', error);
      VNodeTree.value = null;
    }
  },
  { immediate: true }
);
</script>
