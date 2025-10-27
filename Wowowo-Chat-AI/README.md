# Wowowo-Chat-AI

一个简易的AI聊天软件

## 简介

Wowowo-Chat-AI是一个简易的AI聊天软件，使用TypeScript结合nextjs、redis、mongodb作为后端数据库，使用国内的Z智谱的glm-4模型作为AI聊天引擎，支持简单对话(OPENAI免费额度有限，之后要付费😟)

前端使用 Vue3 + Vite + TypeScript + TailwindCSS + Pinia + Vue-Router + VantUI

头像用的芙宁娜，想用啥头像就到assets中去修改就行了，等宽高比较好，不然会不协调

## 功能

路由懒加载

响应式布局，使用tailwind结合flex进行css样式编写和布局，组件位置会随窗口的大小变化；

使用TailwindCSS进行白天黑夜主题切换，切换过渡时间设置为0.2s，且进行本地保存，页面刷新之后依旧会保留刷新前的主题，且组件挂载之后会自动进行一次读取主题颜色(在组件ThemeButton中实现)；

Wowowo-Chat-AI只能进行简易的聊天，AI会根据用户的输入生成回复，可以联系上下文，但是模型比较呆，效果不好；

ai聊天结果为markdown模式，故此处进行了处理，并实现对应换行，不然会回复结果会很丑，变成一堆；

聊天记录可以进行保存，但是刷新页面或者重新启动之后就失效了；

VantUI使用按需导入

这边还可以优化一下：

1、ai给出回答时是一次性给出所有答案，而不是流水式(此处可以使用Stream-Chat解决)；

2、无法进行本地保存，每次刷新页面或者重新启动之后，聊天记录就没了；

3、增加其他文件上传功能，比如图片这种

4、实现根据新的回答页面视口跟着跳转到输入问题的地方，这边不会

5、登陆界面的联想提示点击之后会破坏样式

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

STREAM_API_KEY，STREAM_API_SECRET，这两个为Stream-Chat的API密钥，用于获取Stream的Token；

BIGMODEL_API_KEY，这个是Z智谱的API密钥，用于获取AI回复；

DATABASE_URL，这个是NEON的数据库连接地址，用于存储聊天记录；

3. 配置package.json中的script命令(这边已经配置好了)

```js
"scripts": {
    "dev": "tsc --noEmit && tsx --watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  },
```

4. 生成本地数据库(这一步我不知道有啥用，后端是跟着别人的教程写的，一点都不懂，只会express)

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

在src文件同级目录下创建.env文件，并添加以下内容(这边也已经配置好了)：

VITE_API_URL = http://localhost:7000 ，这个为CHAT-AI-API的地址，与上面的PORT保持一致就行;

3. 启动服务

```
npm run dev
```

### 运行提醒事项

登陆界面是一个用户名和邮箱，有时候要挂梯子，因为数据库用的是Stream和NEON，不然会显示失败，因为加载超时

用户名我这边用的是wowowo-chat-ai，邮箱用的qq邮箱

随便给用户名就行，然后对应的远程的Stream-Chat和NEON就会生成一个对应的用户名

登录之后就是正常的对话界面了
