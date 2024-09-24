import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LikesController } from '../controllers/likes.controller';
import { LikesService } from '../services/likes.service';
import { Comment, CommentSchema } from '../schemas/comment.schema';
import { Like, LikeSchema } from '../schemas/like.schema';
import { Video, VideoSchema } from '../schemas/video.schema';
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
