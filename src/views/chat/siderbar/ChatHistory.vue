<template>
  <div class="mt-6 px-6">
    <h2 class="mb-2 text-xl font-semibold dark:text-white transition-all duration-200">
      对话历史记录
    </h2>

    <div
      v-for="(item, index) in chatStore.getAllChats()"
      :key="index"
      class="px-4 py-2 w-full rounded-xl cursor-pointer text-lg transition-all duration-200"
      :class="{
        // 这个用来实现选中时一直高亮
        'bg-gray-200 dark:bg-gray-700 text-black dark:text-white transition-all duration-200':
          chatStore.curname === item,
        'bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-all duration-200':
          chatStore.curname !== item,
      }"
      @click="chatStore.selectChat(item)"
    >
      <div class="flex justify-between items-center">
        <span class="flex-1 truncate">{{ item }}</span>
        <span class="text-sm ml-4 flex items-center justify-center">
          {{ formatTime(chatStore.getTime(item)) }}

          <el-popover placement="bottom" trigger="hover" :hide-after="0" :width="30">
            <template #reference>
              <el-icon
                :size="18"
                class="ml-2 p-1 rounded-full bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 transition-all duration-200"
              >
                <More />
              </el-icon>
            </template>

            <div>
              <button
                class="cursor-pointer w-full px-2 py-2 rounded-md text-left text-sm flex items-center justify-between hover:bg-gray-100"
                @click="openEditDialog(item)"
              >
                <span> 重命名 </span>
                <el-icon :size="14">
                  <Edit />
                </el-icon>
              </button>

              <button
                class="cursor-pointer w-full px-2 py-2 rounded-md text-left text-sm flex items-center justify-between hover:bg-gray-100"
                @click="chatStore.deleteChat(item)"
              >
                <span class="text-red-500 hover:text-red-600 dark:hover:text-red-400"> 删除 </span>
                <el-icon :size="14">
                  <Delete class="text-red-500" />
                </el-icon>
              </button>
            </div>
          </el-popover>
        </span>
      </div>
    </div>

    <el-dialog v-model="showEditDialog" title="重命名对话" width="20%" draggable>
      <el-input
        v-model="newTitle"
        placeholder="输入新名称"
        @keyup.enter="handleUpdateTitle(currentItem)"
      />
      <template #footer>
        <el-button @click="showEditDialog = false">取消</el-button>
        <el-button type="primary" @click="handleUpdateTitle(currentItem)">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useChatStore } from '@/stores/chat';

const chatStore = useChatStore();
const showEditDialog = ref(false);
const newTitle = ref('');
const currentItem = ref('');

const formatTime = (timestamp: number) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - timestamp;

  // 如果是今天的消息(getDate相同表示日期相同)，显示时间
  if (diff < 24 * 60 * 60 * 1000 && date.getDate() === now.getDate()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return date.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const openEditDialog = (item: string) => {
  currentItem.value = item;
  newTitle.value = item;
  showEditDialog.value = true;
};

const handleUpdateTitle = (currentItem: string) => {
  chatStore.updateChatName(currentItem, newTitle.value.trim());
  showEditDialog.value = false;
  newTitle.value = '';
};
</script>
