<template>
  <div class="mx-auto max-w-2xl p-6">
    <el-upload
      drag
      :auto-upload="false"
      :on-change="handleFileChange"
      :show-file-list="true"
      class="w-full"
    >
      <div class="flex flex-col items-center justify-center py-12">
        <i class="mb-4 text-6xl text-gray-400"></i>
        <div class="text-lg text-gray-500">
          将文件拖到此处或<em class="text-blue-600">点击选择</em>
        </div>
      </div>
    </el-upload>

    <div v-if="file" class="mt-6 rounded-lg bg-white p-6 shadow-sm">
      <div class="space-y-4">
        <p class="text-gray-700">
          <span class="font-medium">文件名:</span>
          {{ file.name }}
        </p>
        <p class="text-gray-700">
          <span class="font-medium">大小:</span>
          {{ formatSize(file.size) }}
        </p>

        <el-progress :percentage="progressPercent" :status="uploadStatus" class="w-full" />
        <div class="flex space-x-4">
          <el-button type="primary" :loading="isUploading" @click="startUpload" class="flex-1">
            开始上传
          </el-button>
          <el-button v-if="isPaused" @click="resumeUpload" class="flex-1"> 继续 </el-button>
          <el-button v-else @click="pauseUpload" class="flex-1"> 暂停 </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const file = ref(null);
const chunkSize = ref(2 * 1024 * 1024); // 2MB
const uploadedChunks = ref([]);
const isUploading = ref(false);
const isPaused = ref(false);
const uploadStatus = ref('');
const progressPercent = ref(0);

const calculateHash = (file) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('../../utils/hashWorker.js', import.meta.url));

    worker.onmessage = (e) => {
      const { type, hash, errorMessage } = e.data;
      if (type === 'complete') {
        resolve(hash);
        worker.terminate();
      } else if (type === 'error') {
        reject(new Error(errorMessage));
        worker.terminate();
      }
    };

    worker.onerror = (err) => {
      reject(err);
      worker.terminate();
    };

    worker.postMessage({
      file,
      chunkSize: 5 * 1024 * 1024,
    });
  });
};

const handleFileChange = async (uploadFile) => {
  file.value = uploadFile.raw;
  progressPercent.value = 0;
  uploadedChunks.value = [];
};

const startUpload = async () => {
  if (!file.value) return;

  isUploading.value = true;
  uploadStatus.value = '';

  try {
    const fileHash = await calculateHash(file.value);

    const { data } = await axios.get('/api/check', {
      params: { hash: fileHash, name: file.value.name },
    });
    uploadedChunks.value = data.uploadedChunks || [];

    await uploadChunks(fileHash);

    await axios.post('/api/merge', {
      hash: fileHash,
      name: file.value.name,
      chunkCount: Math.ceil(file.value.size / chunkSize.value),
    });

    uploadStatus.value = 'success';
  } catch (error) {
    uploadStatus.value = 'exception';
    console.error('上传失败:', error);
  } finally {
    isUploading.value = false;
  }
};

const uploadChunks = async (fileHash) => {
  const chunks = Math.ceil(file.value.size / chunkSize.value);
  const requests = [];

  for (let i = 0; i < chunks; i++) {
    if (uploadedChunks.value.includes(i)) {
      progressPercent.value = Math.floor(((i + 1) / chunks) * 100);
      continue;
    }

    const chunk = file.value.slice(
      i * chunkSize.value,
      Math.min((i + 1) * chunkSize.value, file.value.size)
    );
    const formData = new FormData();
    formData.append('chunk', chunk);
    formData.append('hash', fileHash);
    formData.append('index', i);
    formData.append('name', file.value.name);

    requests.push(
      axios
        .post('/api/upload', formData, {
          onUploadProgress: (e) => {
            if (e.lengthComputable) {
              const loadedChunks = uploadedChunks.value.length;
              const currentChunkProgress = (e.loaded / e.total) * (100 / chunks);
              progressPercent.value = Math.min(
                100,
                (loadedChunks / chunks) * 100 + currentChunkProgress
              );
            }
          },
        })
        .then(() => {
          uploadedChunks.value.push(i);
        })
    );

    if (isPaused.value) {
      await new Promise((resolve) => {
        const checkPause = setInterval(() => {
          if (!isPaused.value) {
            clearInterval(checkPause);
            resolve();
          }
        }, 500);
      });
    }
  }

  await Promise.all(requests);
};

const pauseUpload = () => {
  isPaused.value = true;
  uploadStatus.value = 'warning';
};

const resumeUpload = () => {
  isPaused.value = false;
  uploadStatus.value = '';
};

const formatSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
</script>
