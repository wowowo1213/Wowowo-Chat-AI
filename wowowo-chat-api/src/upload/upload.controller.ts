import { Controller, Post, UploadedFile, UseInterceptors, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { type Response } from 'express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Controller('upload')
export class UploadController {
  @Post('file')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/images',
        filename: (_, file, callback) => {
          const ext = path.extname(file.originalname);
          const filename = `${uuidv4()}${ext}`;
          callback(null, filename);
        },
      }),
      limits: {
        fileSize: 1024 * 1024 * 5,
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File, @Res() res: Response) {
    try {
      const ngrokBaseUrl = 'http://localhost:3000';
      const imageUrl = `${ngrokBaseUrl}/public/images/${file.filename}`;

      res.json({ url: imageUrl });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: '上传失败', message: error.message });
      }
    }
  }
}
