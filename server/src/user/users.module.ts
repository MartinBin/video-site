import {forwardRef, Module} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './schema/user.schema';
import * as dotenv from 'dotenv';
import {VideosService} from "../video/videos.service";
import {VideoModule} from "../video/videos.module";
import {Video, VideoSchema} from "../video/schema/video.schema";

dotenv.config();

@Module({
  imports: [
    forwardRef(() => VideoModule),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      {
        name: Video.name,
        schema: VideoSchema,
      },
    ]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
