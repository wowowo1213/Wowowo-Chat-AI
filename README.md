# Wowowo-Chat-AI
一个简单的AI聊天软件

## 简介
Wowowo-Chat-AI是一个简易的AI聊天软件，使用TypeScript结合express以及NEON作为后端数据库，使用国内的Z智谱的glm-4模型作为AI聊天引擎。

## 功能
Wowowo-Chat-AI只能进行简易的聊天，AI会根据用户的输入生成回复；
聊天记录可以进行保存，但是刷新页面或者重新启动之后就失效了；
这边还可以优化一下：
1、根据上下文进行回答，此处AI只能回答单个信息，无法结合上下文；
2、无法进行本地保存，每次刷新页面或者重新启动之后，聊天记录就没了。

## 使用方法
先运行CHAT-AI-API，再运行Wowowo-Chat-AI
尽量写详细一点，因为自己也容易忘记🤣🤣

### CHAT-AI-API的使用
1. 安装依赖
```
npm install
```

2. 配置环境变量
在src文件同级目录下创建.env文件，并添加以下内容：
PORT=7000，这个为本地运行的端口号；(随便配置一个就行，反正express中会监听然后输出打印的)
STREAM_API_KEY，STREAM_API_SECRET，这两个为Stream的API密钥，用于获取Stream的Token；
BIGMODEL_API_KEY，这个是Z智谱的API密钥，用于获取AI回复；
DATABASE_URL，这个是NEON的数据库连接地址，用于存储聊天记录；

3. 配置package.json中的script命令
```js
"scripts": {
    "dev": "tsc --noEmit && tsx --watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  },
```

4. 生成本地数据库
```
npx drizzle-kit generate
npx drizzle-kit migrate
```

5. 启动服务
```
npm run dev
```

### Wowowo-Chat-AI的使用
1. 安装依赖
```
npm install
```

2. 配置环境变量
在src文件同级目录下创建.env文件，并添加以下内容：
VITE_API_URL = http://localhost:7000，这个为CHAT-AI-API的地址，与上面的PORT保持一致就行;

3. 启动服务
```
npm run dev
```

### 运行提醒事项
登陆界面是一个用户名和邮箱，要挂梯子，因为数据库用的是Stream和NEON，不然会显示失败，
登录之后就是正常的对话界面了

