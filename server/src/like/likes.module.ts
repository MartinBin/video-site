import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { Comment, CommentSchema } from '../comment/schema/comment.schema';
import { Like, LikeSchema } from './schema/like.schema';
import { Video, VideoSchema } from '../video/schema/video.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { 
        name: Comment.name,
        schema: CommentSchema
      },
      {
        name: Like.name,
        schema: LikeSchema
      },
      { 
        name: Video.name,
        schema: VideoSchema
      }]),
  ],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
