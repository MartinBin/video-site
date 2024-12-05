import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { VideosController } from 'src/video/videos.controller';
import { Video, VideoSchema } from './schema/video.schema';
import { UsersModule } from 'src/user/users.module';
import { VideosService } from 'src/video/videos.service';
import { UsersService } from 'src/user/users.service';
import { BullModule } from '@nestjs/bull';
import { VideoProcessor } from './video.processor';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      {
        name: Video.name,
        schema: VideoSchema,
      },
    ]),
    BullModule.registerQueue({
      name: 'video',
    }),
  ],
  providers: [VideosService, VideoProcessor],
  controllers: [VideosController],
  exports:[VideosService],
})
export class VideoModule {}
