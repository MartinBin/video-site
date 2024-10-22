import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { VideoCommentsController } from "./comments.controller";
import { VideoCommentsService } from "src/comment/comments.service";
import { Comment, CommentSchema } from "./schema/comment.schema";
import { Video, VideoSchema } from "src/video/schema/video.schema";

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