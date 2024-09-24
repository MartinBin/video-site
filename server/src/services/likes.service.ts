import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from '../schemas/comment.schema';
import { CreateLikeDto } from '../dto/create-like.dto';
import { Video, VideoDocument } from '../schemas/video.schema';

@Injectable()
export class LikesService {
  constructor(
    @InjectModel(Comment.name) private videoModel: Model<VideoDocument>
  ) {}

  async likeComment(videoId: string, commentId: string, createLikeDto: CreateLikeDto): Promise<Comment> {
    const video = await this.videoModel.findByIdAndUpdate(
      {_id: videoId,'comments._id': commentId},
      { $push: { 'comments.$.likes': createLikeDto } },
      { new: true, runValidators: true }
    ).exec();

    if (!video) {
      throw new NotFoundException('Video or comment not found');
    }
    return video.comments[0];
  }

  async unlikeComment(videoId: string, commentId: string, createLikeDto: CreateLikeDto): Promise<Comment> {
    const video = await this.videoModel.findByIdAndUpdate(
      {_id: videoId,'comments._id': commentId},
      { $pull: { 'comments.$.likes': createLikeDto } },
      { new: true }
    ).exec();

    if (!video) {
      throw new NotFoundException('Video or comment not found');
    }

    return video.comments[0];
  }

  async getLikesCount(videoId: string, commentId: string): Promise<number> {
    const video = await this.videoModel.findOne(
      {_id: videoId,'comments._id': commentId},
      {'comments.$': 1}
    ).exec();
    if (!video || !video.comments[0]) {
      throw new NotFoundException('Video or comment not found');
    }
    return video.comments[0].likes?.length || 0;
  }
}
