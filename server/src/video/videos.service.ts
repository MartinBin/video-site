import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateVideoDto } from 'src/video/dto/create-video.dto';
import { Video } from './schema/video.schema';
import * as fs from 'fs';
import * as path from 'path';
import { UpdateVideoDto } from 'src/video/dto/update-video.dto';
import { UsersService } from 'src/user/users.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class VideosService {
  constructor(
    @InjectModel(Video.name) private videoModel: Model<Video>,
    private usersService: UsersService,
  ) {}
  async createVideo(
    createVideoDto: CreateVideoDto,
    video: Express.Multer.File,
    thumbnail: Express.Multer.File,
    userId: string,
  ): Promise<Video> {
    const videoId = uuidv4();
    const userIdString = userId.toString();

    const videoFileName = `${videoId}_${video.originalname}`;
    const thumbnailFileName = `${videoId}_${thumbnail.originalname}`;

    const videoFolderPath = path.join(__dirname, '..', '..', 'uploads', userIdString, `${videoId}`);

    if (!fs.existsSync(videoFolderPath)) {
      fs.mkdirSync(videoFolderPath, { recursive: true });
    }

    const videoFilePath = path.join(videoFolderPath, videoFileName);
    const thumbnailFilePath = path.join(videoFolderPath, thumbnailFileName);

    fs.writeFileSync(videoFilePath, video.buffer);
    fs.writeFileSync(thumbnailFilePath, thumbnail.buffer);

    const newVideo = new this.videoModel({
      ...createVideoDto,
      userId,
      url: `/uploads/${userIdString}/${videoId}/${videoFileName}`,
      thumbnail: `/uploads/${userIdString}/${videoId}/${thumbnailFileName}`,
    });

    return await newVideo.save();
  }

  async findOneVideo(id: string) {
    const foundVideo = await this.videoModel.findById(id).exec();
    if (!foundVideo) {
      throw new NotFoundException(`Video with ID "${id}" not found`);
    }
    const user = await this.usersService.findById(foundVideo.userId);
    return { foundVideo, userName: user.username };
  }
  findAllVideos() {
    return this.videoModel.find().exec();
  }

  async updateVideo(
    id: string,
    updateVideo: UpdateVideoDto,
    userId: string,
    userRole: any,
  ) {
    const video = await this.videoModel.findById(id).exec();

    if (!video) {
      throw new NotFoundException(`Video with ID "${id}" not found`);
    }

    if (userRole !== 'admin' && video.userId.toString() !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to delete this video',
      );
    }

    const updatedVideo = await this.videoModel.findByIdAndUpdate(
      id,
      { $set: updateVideo },
      { new: true, runValidators: true },
    );

    if (!updatedVideo) {
      throw new NotFoundException(`Video with ID "${id}" not found`);
    }
    return updatedVideo;
  }

  async deleteVideo(id: string, userId: string, userRole: any) {
    const video = await this.videoModel.findById(id).exec();

    if (!video) {
      throw new NotFoundException(`Video with ID "${id}" not found`);
    }

    if (userRole !== 'admin' && video.userId.toString() !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to delete this video',
      );
    }
    const deletedVideo = await this.videoModel.findByIdAndDelete(id).exec();
    if (!deletedVideo) {
      throw new NotFoundException(`Video with ID "${id}" not found`);
    }

    if (deletedVideo.url) {
      const filePath = path.join(__dirname, '..', '..', deletedVideo.url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    return deletedVideo;
  }
  
  async getVideoByUserId(id: string){
    try {
      // First check if user exists
      await this.usersService.findById(id);

      // Then find videos for that user
      const videos = await this.videoModel
          .find({ userId: id })
          .exec();

      return videos;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('Videos not found');
    }
  }
}
