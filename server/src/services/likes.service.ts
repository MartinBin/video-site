import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { Comment, CommentDocument } from '../schemas/comment.schema';
import { CreateLikeDto } from '../dto/create-like.dto';
import { Video, VideoDocument } from '../schemas/video.schema';
import { Like,LikeDocument, LikeSchema } from '../schemas/like.schema'; // Assuming Like schema is defined

@Injectable()
export class LikesService {
  constructor(
    @InjectModel(Video.name) private videoModel: Model<VideoDocument>,
  ) {}

  async likeComment(videoId: string, commentId: string, createLikeDto: CreateLikeDto): Promise<Comment> {
    const video = await this.videoModel.findById(videoId).exec();
    if (!video) {
      throw new NotFoundException('Video not found');
    }
    
    const commentIndex = video.comments.findIndex(comment => comment._id.toString() === commentId);
    if (commentIndex === -1) {
      throw new NotFoundException('Comment not found');
    }
    
    const newLike = {
      userDisplayName: createLikeDto.userDisplayName,
      createdAt: new Date()
    };
    
    video.comments[commentIndex].likes.push(newLike as any);
    const updatedVideo = await video.save();
    const updatedComment = updatedVideo.comments[commentIndex];

    return updatedComment;
  }

  async unlikeComment(videoId: string, commentId: string,likeId: string): Promise<Comment> {
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
