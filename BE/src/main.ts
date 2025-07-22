// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*', // ⚠️ WARNING: Allow all origins (for development only)
    // For production use: origin: 'https://your-frontend.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Optional: use if cookies or authorization headers are used
  });

  await app.listen(3000);
}
bootstrap();
