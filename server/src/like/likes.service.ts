import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { Comment, CommentDocument } from '../comment/schema/comment.schema';
import { CreateLikeDto } from './dto/create-like.dto';
import { Video, VideoDocument } from '../video/schema/video.schema';
import { Like, LikeDocument, LikeSchema } from './schema/like.schema'; // Assuming Like schema is defined

@Injectable()
export class LikesService {
  constructor(
    @InjectModel(Video.name) private videoModel: Model<VideoDocument>,
  ) {}

  async likeComment(
    videoId: string,
    commentId: string,
    createLikeDto: CreateLikeDto,
    userId: string,
  ): Promise<Comment> {
    const video = await this.videoModel.findById(videoId).exec();
    if (!video) {
      throw new NotFoundException('Video not found');
    }

    const commentIndex = video.comments.findIndex(
      (comment) => comment._id.toString() === commentId,
    );
    if (commentIndex === -1) {
      throw new NotFoundException('Comment not found');
    }

    const newLike = {
      userDisplayName: createLikeDto.userDisplayName,
      createdAt: new Date(),
      userId: userId,
    };

    video.comments[commentIndex].likes.push(newLike as any);
    const updatedVideo = await video.save();
    const updatedComment = updatedVideo.comments[commentIndex];

    return updatedComment;
  }

  async unlikeComment(
    videoId: string,
    commentId: string,
    likeId: string,
    userId: string,
  ): Promise<Comment> {
    const video = await this.videoModel.findById(videoId).exec();
    if (!video) {
      throw new NotFoundException('Video not found');
    }

    const commentIndex = video.comments.findIndex(
      (comment) => comment._id.toString() === commentId,
    );
    if (commentIndex === -1) {
      throw new NotFoundException('Comment not found');
    }

    const comment = video.comments[commentIndex];
    const likeIndex = comment.likes.findIndex(
      (like) => like._id.toString() === likeId,
    );
    if (likeIndex === -1) {
      throw new NotFoundException('Like not found for this comment');
    }
    if (
      video.comments[commentIndex].likes[likeIndex].userId.toString() !== userId
    ) {
      throw new UnauthorizedException(
        'You are not authorized to delete this video',
      );
    }
    // Remove the like from the comment
    comment.likes.splice(likeIndex, 1);

    const updatedVideo = await video.save();
    const updatedComment = updatedVideo.comments[commentIndex];

    return updatedComment;
  }

  async getLikesCount(
    videoId: string,
    commentId: string,
  ): Promise<{ likesCount: number }> {
    const video = await this.videoModel
      .findOne({ _id: videoId, 'comments._id': commentId }, { 'comments.$': 1 })
      .exec();
    if (!video || !video.comments[0]) {
      throw new NotFoundException('Video or comment not found');
    }
    const likesCount = video.comments[0].likes?.length || 0;

    return { likesCount };
  }
  async getLikes(videoId: string, commentId: string): Promise<Like[]> {
    const video = await this.videoModel
      .findOne({ _id: videoId, 'comments._id': commentId }, { 'comments.$': 1 })
      .exec();
    if (!video || !video.comments[0]) {
      throw new NotFoundException('Video or comment not found');
    }

    return video.comments[0].likes;
  }

  async getLikesByUsername(
    videoId: string,
    commentId: string,
    userName: string,
  ): Promise<Like[]> {
    const video = await this.videoModel
      .findOne({ _id: videoId, 'comments._id': commentId }, { 'comments.$': 1 })
      .exec();

    if (!video || !video.comments[0]) {
      throw new NotFoundException('Video or comment not found');
    }

    const likes = video.comments[0].likes || [];

    const userLikes = likes.filter((like) => like.userDisplayName === userName);

    if (userLikes.length === 0) {
      throw new NotFoundException(`No likes found for user: ${userName}`);
    }

    return userLikes;
  }
}
