import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Video, VideoDocument } from '../schemas/video.schema';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { Comment } from '../schemas/comment.schema';

@Injectable()
export class VideoCommentsService {

  constructor(@InjectModel(Video.name) private videoModel: Model<VideoDocument>) {}

  async addComment(videoId: string, createCommentDto: CreateCommentDto): Promise<Video> {
    return this.videoModel.findByIdAndUpdate(
      videoId,
      { $push: { comments: createCommentDto } },
      { new: true, runValidators: true }
    ).exec();
  }

  async findAllForVideo(videoId: string): Promise<Comment[]> {
    const video = await this.videoModel.findById(videoId).exec();
    return video?.comments || [];
  }

  async findAll(): Promise<Comment[]> {
    const videos = await this.videoModel.find().exec();
    return videos.reduce((allComments, video) => {
      return allComments.concat(video.comments || []);
    }, []);
  }
}
