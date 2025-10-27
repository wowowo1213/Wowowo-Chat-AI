<template>
  <div class="px-40 py-4 bg-white flex items-center dark:bg-gray-800 transition-all duration-200">
    <textarea
      v-model="message"
      ref="textareaRef"
      placeholder="请输入问题"
      @keyup.enter="sendMessage"
      @input="adjustTextareaHeight"
      rows="2"
      class="resize-none overflow-y-auto max-h-44 flex-grow p-2 rounded-lg border-2 focus:outline-none placeholder:text-gray-400 bg-white text-gray-700 border-gray-400 hover:border-gray-700 focus:border-blue-500 dark:bg-gray-600 dark:text-gray-100 dark:border-gray-400 dark:hover:border-gray-300 dark:focus:border-blue-400 transition-all duration-200"
    />
    <!-- 上面这边border设置为2，效果更明显，设置为1更美观；输入框有三种状态，正常，鼠标悬浮，获得焦点，分别设置了三种颜色 -->

    <div class="flex items-center">
      <button
        class="rounded-full w-6 h-6 ml-2 flex justify-center items-center cursor-pointer bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 hover:scale-90 hover:rotate-90 transition-all duration-200"
        @click="loadFile"
      >
        <van-icon name="plus" />
      </button>

      <button
        @click="sendMessage"
        class="ml-2 px-4 py-2 h-11 rounded-lg cursor-pointer text-white bg-blue-500 hover:bg-blue-600 dark:bg-gray-700 dark:hover:bg-gray-900 transition-all duration-200"
      >
        点我发送
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const message = ref('');
const textareaRef = ref<HTMLTextAreaElement | null>(null);

const adjustTextareaHeight = () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto';
    // 下面这边取max主要是删除所有文字之后，回不到初始高度，内容区少了4px，这边手动加上，看浏览器检查为总高度68px
    // 找不到更好的办法了~>_<~，问ai和查百度也找不到更好的
    textareaRef.value.style.height = `${Math.max(textareaRef.value.scrollHeight, 68)}px`;
  }
};

const loadFile = () => {};

const sendMessage = () => {
  console.log(111);
};
</script>
