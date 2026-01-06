# Wowowo-Chat-AI

**基于通义千问-Plus的全栈AI聊天应用** 🚀

---

## 项目简介

Wowowo-Chat-AI 是一个采用 **TypeScript** 开发的前后端分离AI聊天应用：

### 技术栈

- **前端**：Vue3 + Vite + TypeScript + TailwindCSS + Pinia + Vue-Router + Element Plus
- **后端**：Nest.js + TypeScript
- **AI引擎**：通义千问-Plus（Qwen-Plus）

---

## 核心功能

### 前端特性

| 功能                 | 描述                                                                              |
| -------------------- | --------------------------------------------------------------------------------- |
| 🎨 **UI 设计**       | 仿文心一言界面，响应式布局（TailwindCSS + Flex）                                  |
| 🌓 **主题切换**      | 白天/黑夜模式（0.2s 过渡动画，本地持久化存储）                                    |
| ⚡ **流式响应**      | 使用通义千问 `stream: true` 模式，实时显示回答                                    |
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

## 快速开始

### 1. 环境准备

- **Node.js** ≥ 18.x
- **阿里云通义千问API Key**（[申请地址](https://dashscope.console.aliyun.com/)）

### 2. 后端启动 (`wowowo-chat-api`)

这边上传到github的时候可能会遇到ca证书认证未通过的问题，需要配置一下nodejs的ca认证证书

```bash
# 克隆仓库
git clone https://github.com/wowowo1213/Wowowo-Chat-AI

# 选择仓库
cd Wowowo-Chat-AI
cd wowowo-chat-api

# 安装依赖
npm install

# 配置环境变量
# .env文件
# 修改以下字段：
# PORT = 5000
# DASHSCOPE_API_KEY = 你的通义千问API Key
# GITHUB_TOKEN=github的accessToken
# GITHUB_REPO_OWNER=用户名
# GITHUB_REPO_NAME=仓库名
# GITHUB_BRANCH=main

# 启动服务(二选一)
npm run start:dev  # 开发模式（热更新）
npm run start      # 生产模式
```

### **3. 前端启动（Wowowo-Chat-AI）**

```bash
# 选择仓库
cd Wowowo-Chat-AI

# 安装依赖
npm install

# 配置环境变量
# .env文件
# 修改以下字段：
# VITE_API_URL = http://localhost:5000
# 上面这边主要是为了和后端的本地运行端口保持一致，可自行修改，也可以自行配置跨域

# 启动服务
npm run dev
```

## Wowowo-Chat-AI 项目结构

```bash
wowowo-chat-ai/
├── src/
│   ├── assets/                         # 静态资源(图片等)
│   ├── components/                     # 通用组件
│   │   └── ThemeButton.vue             # 主题切换按钮
│   ├── services/
│   │   └── chat.ts                     # 向后端发起请求并处理数据
│   ├── stores/                         # Pinia 状态管理
│   │   ├── chat.ts                     # 聊天状态（含持久化）
│   │   └── user.ts                     # 用户信息
│   ├── views/                          # 页面
│   │   ├── chat                        # 聊天页面
│   │   │   ├── siderbar                # 侧边栏组件
│   │   │   │   ├── ChatHistory.vue     # 侧边栏对话历史记录
│   │   │   │   ├── index.vue           # 侧边栏总界面
│   │   │   │   ├── SiderbarHeader.vue  # 侧边栏头部
│   │   │   │   └── UserInfo.vue        # 侧边栏底部(用户信息)
│   │   │   ├── AiMessageContent.vue    # AI回答信息渲染组件
│   │   │   ├── ChatHeader.vue          # 聊天界面头部组件
│   │   │   ├── ChatHome.vue            # 聊天消息默认界面，暂时未使用
│   │   │   ├── ChatInput.vue           # 聊天输入框组件
│   │   │   ├── ChatMessage.vue         # 聊天消息组件
│   │   │   └── ChatIndex.vue           # 聊天界面总页面
│   │   └── login                       # 登陆界面
│   ├── App.vue                         # 根组件
│   └── main.ts                         # 入口文件
│
├── .env                                # 前端环境变量配置
│
├── wowowo-chat-api/                    # 后端源码（NestJS）
│   ├── src/                            # 源码目录
│   │   ├── chat/                       # 聊天功能模块
│   │   │   ├── chat.controller.ts      # 聊天控制器
│   │   │   ├── chat.service.ts         # 聊天服务
│   │   │   └── chat.module.ts          # 聊天模块模块注册与依赖注入
│   │   ├── upload/                     # 图片上传模块
│   │   ├── userinfo/                   # 用户信息功能模块
│   │   │   ├── userinfo.controller.ts  # 用户信息控制器
│   │   │   ├── userinfo.dto.ts         # 数据传输对象
│   │   │   ├── userinfo.service.ts     # 用户服务
│   │   │   └── uiserinfo.module.ts     # 用户信息模块注册与依赖注入
│   │   ├── app.module.ts               # 根模块
│   │   └── main.ts                     # 后端入口
│   ├── .env                            # 后端环境变量配置
│   └── package.json                    # 后端依赖
│
└── README.md                           # 项目说明
```
