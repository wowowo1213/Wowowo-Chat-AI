# Wowowo-Chat-AI

**基于通义千问-Plus的全栈AI聊天应用** 🚀

---

## 项目简介

Wowowo-Chat-AI 是一个采用 **TypeScript** 开发的前后端分离AI聊天应用：

### 技术栈

- **前端**：Vue3 + Vite + TypeScript + TailwindCSS + Pinia + Vue-Router + Element Plus
- **后端**：Nest.js + TypeScript
- **AI引擎**：通义千问-Plus（Qwen-Plus）
- **数据库**：Redis、MongoDB（后端不会，所以弃置了）

---

## 核心功能

### 前端特性

| 功能                 | 描述                                                                              |
| -------------------- | --------------------------------------------------------------------------------- |
| 🎨 **UI 设计**       | 仿文心一言界面，响应式布局（TailwindCSS + Flex）                                  |
| 🌓 **主题切换**      | 白天/黑夜模式（0.2s 过渡动画，本地持久化存储）                                    |
| ⚡ **流式响应**      | 支持通义千问 `stream: true` 模式，实时显示回答                                    |
| 📜 **上下文对话**    | 自动保留最近 10 条消息作为对话上下文                                              |
| ⏸️ **交互控制**      | 回答过程中悬停“发送中”按钮可变成红色按钮，点击中断生成                            |
| 💾 **状态持久化**    | 使用 `pinia-plugin-persistedstate` 保存历史记录，按更新时间降序排序，支持高亮选中 |
| 📝 **Markdown 渲染** | 通过 `markdown-it` 支持代码高亮和格式化显示                                       |
| 🚀 **性能优化**      | 使用 `vue-virtual-scroller` 优化长对话渲染                                        |

### 后端特性

| 功能            | 描述                        |
| --------------- | --------------------------- |
| 🤖 **AI集成**   | 接入通义千问-Plus流式API    |
| 🛡️ **异常处理** | 全局异常拦截 + 统一响应格式 |

---

## 待优化清单

1. ✅ **视口控制**：新消息自动滚动到可视区域
2. 🌙 **滚动条样式**：适配黑夜模式的滚动条颜色
3. 📂 **主页跳转**：优化主页到历史记录的跳转逻辑
4. 📁 **文件上传**：美化上传按钮样式
5. 🎤 **录音优化**: 实现可录音

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
cd Wowowo-Chat-AI
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

## Wowowo-Chat-AI 项目结构

```bash
wowowo-chat-ai/
├── src/
│   ├── assets/                         # 静态资源(图片等)
│   ├── components/                     # 通用组件
│   │   ├── ThemeButton.vue             # 主题切换按钮
│   ├── services/
│   │   ├── chat.ts                     # 向后端发起请求并处理数据
│   ├── stores/                         # Pinia 状态管理
│   │   ├── chat.ts                     # 聊天状态（含持久化）
│   │   └── user.ts                     # 用户信息
│   ├── views/                          # 页面
│   │   ├── chat                        # 聊天界面
│   │   └── login                       # 登陆界面
│   ├── App.vue                         # 根组件
│   ├── main.ts                         # 入口文件
│
├── wowowo-chat-api/                    # 后端源码（NestJS）
│   ├── src/                            # 源码目录
│   │   ├── chat/                       # 聊天功能模块
│   │   │   ├── chat.controller.ts      # 聊天控制器
│   │   │   ├── chat.service.ts         # 聊天服务
│   │   │   └── chat.module.ts          # 聊天模块模块注册与依赖注入
│   │   ├── userinfo/                   # 用户信息功能模块
│   │   │   ├── userinfo.controller.ts  # 用户信息控制器
│   │   │   ├── userinfo.dto.ts         # 数据传输对象
│   │   │   ├── userinfo.service.ts     # 用户服务
│   │   │   └── uiserinfo.module.ts     # 用户信息模块注册与依赖注入
│   │   ├── app.module.ts               # 根模块
│   │   └── main.ts                     # 后端入口
│   ├── .env                            # 环境变量配置
│   └── package.json                    # 后端依赖
│
└── README.md                           # 项目说明
```
