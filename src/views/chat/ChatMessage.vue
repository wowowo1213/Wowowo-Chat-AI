<template>
  <div class="flex-1 overflow-y-auto">
    <DynamicScroller
      class="h-full w-full"
      :items="messages"
      :min-item-size="100"
      :key="chatStore.curname"
      key-field="_key"
    >
      <template #default="{ item, index, active }">
        <DynamicScrollerItem :item="item" :active="active" :data-index="index">
          <div :class="item.role === 'user' ? 'flex justify-end pr-35 pb-6' : 'pl-40 pr-35 pb-6'">
            <div
              v-if="item.role === 'user' && item.content"
              class="dark:text-white bg-gray-100 dark:bg-gray-800 rounded-lg py-4 px-6 transition-all duration-200 max-w-[60%]"
            >
              <p>
                {{ item.content }}
              </p>

              <div v-if="isFile" class="mt-4 inline-flex space-x-5 rounded-lg flex">
                <div class="flex items-center space-x-3 rounded-lg cursor-pointer inline-flex">
                  <div>
                    <img
                      :src="logoImg"
                      alt="图片"
                      class="w-14 h-14 text-sm text-gray-700 dark:text-gray-300 transition-all duration-200"
                    />
                  </div>
                </div>

                <div class="flex flex-col">
                  <span
                    class="text-sm text-gray-700 dark:text-gray-300 transition-all duration-200"
                  >
                    图片标题.pdf
                  </span>
                  <span
                    class="text-sm text-gray-700 dark:text-gray-300 transition-all duration-200"
                  >
                    114514kb
                  </span>
                </div>
              </div>
            </div>

            <div
              v-else
              class="bg-blue-50 dark:text-white dark:bg-gray-800 rounded-lg py-4 px-6 transition-all duration-200"
            >
              <p class="mt-3 text-gray-600 dark:text-gray-400 pb-4">
                回答来自 通义千问-plus 大模型
              </p>
              <p v-if="item.content" class="mb-3">
                {{ item.content }}
              </p>
              <p v-else class="mb-3">网络出错啦，芙宁娜暂时无法回答您的问题🌹</p>
            </div>
          </div>
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useChatStore } from '@/stores/chat';
import logoImg from '@/assets/logo.jpg';

const chatStore = useChatStore();
const messages = computed(() => chatStore.getCurrentMessages());

const isFile = ref(false);

import { apiChat } from '@/api/chat';

// 这个函数只是用来测试的
async function handleChat() {
  try {
    // const response = await apiChat(['你好，我是wowowo，介绍一下前端开发是什么']);
    // console.log('API 返回结果:', response);
  } catch (error) {
    console.error('请求失败:', error);
  }
}

// 调用函数
handleChat();
</script>
