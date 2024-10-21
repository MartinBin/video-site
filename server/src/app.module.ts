import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VideoModule } from './modules/videos.module';
import { CommentModule } from './modules/comments.module';
import { MulterModule } from '@nestjs/platform-express';
import { LikesModule } from './modules/likes.module';
import { UsersModule} from './modules/users.module';
import { AuthModule } from './modules/auth.module';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { PassportModule } from '@nestjs/passport';

dotenv.config();

@Module({
  imports: [
  MongooseModule.forRoot('mongodb://localhost/BinisTube'),
    VideoModule,CommentModule,LikesModule,UsersModule,AuthModule,
    MulterModule.register({
      dest:'./uploads',
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
