import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport";
import { VideosController } from "src/controllers/videos.controller";
import { Video, VideoSchema } from "src/schemas/video.schema";
import { VideosService } from "src/services/videos.service";

@Module({imports:[
    MongooseModule.forFeature([{
        name: Video.name,
        schema: VideoSchema,
    }])],
    providers:[VideosService],
    controllers:[VideosController]
})
export class VideoModule{};