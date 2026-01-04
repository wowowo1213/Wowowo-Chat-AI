import { Controller, Post, Body, UploadedFile, UseInterceptors, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { type Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Controller('upload')
export class UploadController {
  @Post('base64')
  uploadBase64(@Body() body: { image: string }, @Res() res: Response) {
    try {
      const base64Data = body.image.split(',')[1];
      const ext = body.image.startsWith('data:image/jpeg')
        ? '.jpg'
        : body.image.startsWith('data:image/png')
          ? '.png'
          : '.jpg';

      const filename = `${uuidv4()}${ext}`;
      const filepath = path.join(__dirname, '..', '..', 'public', 'images', filename);

      fs.mkdirSync(path.dirname(filepath), { recursive: true });

      fs.writeFileSync(filepath, base64Data, 'base64');

      const imageUrl = `http://localhost:3000/images/${filename}`;

      res.json({ url: imageUrl });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: '上传失败', message: error.message });
      }
    }
  }

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File, @Res() res: Response) {
    try {
      const filename = `${uuidv4()}.${file.originalname.split('.').pop()}`;
      const filepath = path.join(__dirname, '..', '..', 'public', 'images', filename);

      fs.mkdirSync(path.dirname(filepath), { recursive: true });
      fs.renameSync(file.path, filepath);

      const imageUrl = `http://localhost:3000/images/${filename}`;
      res.json({ url: imageUrl });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: '上传失败', message: error.message });
      }
    }
  }
}
