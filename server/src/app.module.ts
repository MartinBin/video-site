import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VideoModule } from './video/videos.module';
import { CommentModule } from './comment/comments.module';
import { MulterModule } from '@nestjs/platform-express';
import { LikesModule } from './like/likes.module';
import { UsersModule } from './user/users.module';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './auth/auth.module';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/BinisTube'),
    VideoModule,
    CommentModule,
    LikesModule,
    UsersModule,
    AuthModule,
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
