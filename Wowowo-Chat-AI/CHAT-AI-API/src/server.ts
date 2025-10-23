import express from 'express';
import { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { StreamChat } from 'stream-chat';
import OpenAI from 'openai';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const chatClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY!,
  process.env.STREAM_API_SECRET!,
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

app.post(
  '/register-user',
  async (req: Request, res: Response): Promise<any> => {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: '姓名或邮件不能为空' });
    }

    try {
      const userId = email.replace(/[^a-zA-Z0-9_-]/g, '_');

      const userRespose = await chatClient.queryUsers({
        id: { $eq: userId }
      })

      if (!userRespose.users.length) {
        await chatClient.upsertUser({
          id: userId,
          name,
          email,
          role: 'user',
        })
      }

      res.status(200).json({ userId, name, email });
    } catch (error) {
      res.status(500).json({ error: '服务器内部错误' });
    }
  }
);

app.post('/chat', async (req: Request, res: Response): Promise<any> => {
  const { userId, message } = req.body;

  if (!userId || !message) {
    return res.status(400).json({ error: '用户ID或消息不能为空' });
  }

  try {
    const userRespose = await chatClient.queryUsers({
      id: userId
    })

    if (!userRespose.users.length) {
      return res.status(400).json({ error: '用户不存在，请先注册' });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: message }]
    });

    const aiMessage = response.choices[0].message?.content ?? 'AI未回复';

    const channel = chatClient.channel('messaging', `chat-${userId}`, {
      name: 'AI Chat',
      created_by_id: 'ai_bot',
    });

    await channel.create();
    await channel.sendMessage({ text: aiMessage, user_id: 'ai_bot' });

    res.status(200).json({ reply: aiMessage });
  } catch (error) {
    console.log('AI响应出错', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`后端服务器运行在 http://localhost:${PORT}`);
})