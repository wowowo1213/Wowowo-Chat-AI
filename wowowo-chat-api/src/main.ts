import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from 'utils/all-exception.filter';
import { TransformInterceptor } from '../utils/transform.interceptor';
import { MyLogger } from '../utils/no-timestamp-logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: new MyLogger() });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // 到这边解决跨域
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
