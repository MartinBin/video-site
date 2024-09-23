import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VideoModule } from './modules/videos.module';
import { CommentModule } from './modules/comments.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/BinisTube'),
    VideoModule,CommentModule,
    MulterModule.register({
      dest:'./uploads',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
