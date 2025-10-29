# **Wowowo-Chat-AI**

**一个简易的AI聊天软件（基于通义千问-Plus）**

---

## **项目简介**

Wowowo-Chat-AI 是一个 **全栈AI聊天应用**，采用 **TypeScript** 开发，前后端分离架构：

- **前端**：Vue3 + Vite + TypeScript + TailwindCSS + Pinia + Vue-Router + Element Plus
  - 响应式布局，支持 **白天/黑夜主题切换**（本地持久化存储，刷新页面后依旧会自动读取上一次的结果，在通用组件ThemeButton.vue中实现）
  - 仿 **文心一言** 界面
  - 支持 **上下文对话**
  - 通过**pinia-plugin-persistedstat**插件，实现pinia的持久化保存，历史记录刷新或重启之后也不会消失
  - 通过**vue-virtual-scroller**插件，实现虚拟滚动，高效渲染对话信息，通过只渲染可视区域内的元素来优化性能。
- **后端**：Nest.js + TypeScript
  - 使用 **通义千问-Plus（Qwen-Plus）** 作为AI引擎
  - 集成 **Redis**（缓存）、**MongoDB**（聊天记录存储）
  - Nest.js中使用了全局异常过滤器 + 统一响应拦截器

---

## **功能特性**

| 模块        | 功能描述                                       |
| ----------- | ---------------------------------------------- |
| **前端**    |                                                |
| ✅ 界面     | 仿文心一言，响应式设计（TailwindCSS + Flex）   |
| ✅ 主题     | 白天/黑夜模式切换（0.2s过渡动画，本地存储）    |
| ✅ 交互     | 路由懒加载（仅ChatView）、Element Plus按需引入 |
| ✅ 回复格式 | Markdown渲染 + 自动换行优化                    |
| **后端**    |                                                |
| ✅ AI引擎   | 通义千问-Plus（Qwen-Plus）流式响应             |
| ✅ 数据存储 | MongoDB（聊天记录）、Redis（缓存）             |
| ✅ 优化     | 全局异常过滤器、统一响应拦截器                 |

---

## **待优化点**

1. **视口跳转**：新回复时自动滚动到最新消息
2. **历史记录**：优化从ChatHome跳转到历史记录的逻辑
3. **UI细节**：上传文件图标样式优化

---

## **快速开始**

### **1. 环境准备**

- **Node.js** ≥ 18.x
- **MongoDB** 和 **Redis**（本地或云服务）
- **阿里云通义千问API Key**（[申请地址](https://dashscope.console.aliyun.com/)）

---

### **2. 后端启动（wowowo-chat-api）**

```bash
# 克隆仓库
git clone https://github.com/Wowowo-Chat-AI.git

# 选择仓库
cd wowowo-chat-api

# 安装依赖
npm install

# 配置环境变量
# .env文件
# 修改以下字段：
# DASHSCOPE_API_KEY=你的通义千问API Key

# 启动服务
npm run start:dev  # 开发模式（热更新）
npm run start      # 生产模式
```

### **3. 前端启动（Wowowo-Chat-AI）**

```bash
# 安装依赖
npm install

# 配置环境变量
# .env文件
# 修改以下字段：
# 修改 VITE_API_URL 为后端地址（如 http://localhost:3000），nest默认运行在3000

# 启动服务
npm run dev
```
