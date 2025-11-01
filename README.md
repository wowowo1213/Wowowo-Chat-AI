# Wowowo-Chat-AI

**一个基于通义千问-Plus的简易AI聊天软件** 🚀

---

## 项目简介

Wowowo-Chat-AI 是一个 **全栈AI聊天应用**，采用 **TypeScript** 开发，前后端分离架构：

- **前端**：Vue3 + Vite + TypeScript + TailwindCSS + Pinia + Vue-Router + Element Plus
  - 响应式布局，左侧边栏支持动态隐藏
  - 支持 **白天/黑夜主题切换**（本地持久化存储）
  - 仿 **文心一言** 界面设计
  - 流水式回答问题（通义千问 `stream: true` 模式）
  - 支持 **上下文对话**（截取最近10条消息）
  - 使用 `pinia-plugin-persistedstate` 实现状态持久化
  - 使用 `vue-virtual-scroller` 优化长对话渲染性能

- **后端**：Nest.js + TypeScript
  - 集成 **通义千问-Plus（Qwen-Plus）** AI引擎
  - 使用 **Redis**/**MongoDB** 存储聊天记录（本来想用的，但是后端不会数据库）
  - 全局异常处理 + 统一响应拦截

---

## 功能特性

| 模块      | 功能描述                                                      |
| --------- | ------------------------------------------------------------- |
| **前端**  |                                                               |
| ✅ 界面   | 仿文心一言设计，响应式布局（TailwindCSS + Flex）              |
| ✅ 主题   | 白天/黑夜模式切换（0.2s过渡动画，本地存储）                   |
| ✅ 交互   | 路由懒加载、Element Plus按需引入                              |
| ✅ 回复   | **Markdown渲染** + 代码高亮 + 流式输出                        |
| **后端**  |                                                               |
| ✅ AI引擎 | 通义千问-Plus流式响应（`stream: true`）                       |
| ✅ 数据   | Redis缓存会话 / MongoDB存储（本来想用的，但是后端不会数据库） |
| ✅ 优化   | 全局异常处理 + 统一响应格式                                   |

---

## 待优化点

1. **视口跳转**：新消息自动滚动到可视区域
2. **滚动条样式**：黑夜模式滚动条颜色适配
3. **历史记录**：优化从主页跳转到历史记录的逻辑
4. **UI细节**：上传文件按钮样式优化

---

## 快速开始

### 1. 环境准备

- **Node.js** ≥ 18.x
- **阿里云通义千问API Key**（[申请地址](https://dashscope.console.aliyun.com/)）

### 2. 后端启动 (`wowowo-chat-api`)

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

# 启动服务(二选一)
npm run start:dev  # 开发模式（热更新）
npm run start      # 生产模式
```

### **3. 前端启动（Wowowo-Chat-AI）**

```bash
# 安装依赖
npm install

# 启动服务
npm run dev
```
