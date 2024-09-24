import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VideoModule } from './modules/videos.module';
import { CommentModule } from './modules/comments.module';
import { MulterModule } from '@nestjs/platform-express';
import { LikesModule } from './modules/likes.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/BinisTube'),
    VideoModule,CommentModule,LikesModule,
    MulterModule.register({
      dest:'./uploads',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
