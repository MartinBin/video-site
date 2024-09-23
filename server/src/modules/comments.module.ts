import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { VideoCommentsController } from "src/controllers/comments.controller";
import { VideoCommentsService } from "src/services/comments.service";
import { Comment, CommentSchema } from "src/schemas/comment.schema";
import { Video, VideoSchema } from "src/schemas/video.schema";

@Module({imports:[
    MongooseModule.forFeature([{
        name: Comment.name,
        schema: CommentSchema,
    },
    {
        name: Video.name,
        schema: VideoSchema,
    }])],
    providers:[VideoCommentsService],
    controllers:[VideoCommentsController]
})
export class CommentModule{};