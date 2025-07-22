import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://murali:ByljH5t3JstNCpLm@cluster0.qxrvsbp.mongodb.net/n8n?retryWrites=true&w=majority',
    ),
    AuthModule,
  ],
})
export class AppModule {}
