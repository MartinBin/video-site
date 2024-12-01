import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Video, VideoDocument } from '../video/schema/video.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './schema/comment.schema';
import { UpdateCommentDto } from 'src/comment/dto/update-comment.dto';

@Injectable()
export class VideoCommentsService {
  constructor(
    @InjectModel(Video.name) private videoModel: Model<VideoDocument>,
  ) {}

  async addComment(
    videoId: string,
    createCommentDto: CreateCommentDto,
    userId: string,
    userName: string,
  ): Promise<Comment> {
    const createCommentDtoWithUserId = {
      ...createCommentDto,
      userId: userId,
      userDisplayName: userName,
      createdAt: new Date(),
    };

    const updatedVideo = await this.videoModel
      .findByIdAndUpdate(
        { _id: videoId },
        { $push: { comments: createCommentDtoWithUserId } },
        { new: true, runValidators: true },
      )
      .exec();

    if (!updatedVideo) {
      throw new NotFoundException('Video not found');
    }

    const newlyAddedComment =
      updatedVideo.comments[updatedVideo.comments.length - 1];

    return newlyAddedComment;
  }

  async findAllForVideo(videoId: string): Promise<Comment[]> {
    const video = await this.videoModel.findById(videoId).exec();
    return video?.comments || [];
  }

  async updateComment(
    videoId: string,
    commentId: string,
    updateCommentDto: UpdateCommentDto,
    userId: string,
  ): Promise<Comment> {
    const video = await this.videoModel.findById(videoId).exec();
    if (!video) {
      throw new NotFoundException('Video not found');
    }

    const commentIndex = video.comments.findIndex(
      (c) => c._id.toString() === commentId,
    );
    if (commentIndex === -1) {
      throw new NotFoundException('Comment not found');
    }

    if (video.comments[commentIndex].userId.toString() !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to delete this video',
      );
    }

    video.comments[commentIndex] = {
      ...video.comments[commentIndex].toObject(),
      ...updateCommentDto,
      updatedAt: new Date(),
    };
    const updatedVideo = await video.save();
    const updatedComment = updatedVideo.comments[commentIndex];

    return updatedComment;
  }

  async deleteComment(
    videoId: string,
    commentId: string,
    userId: string,
    userRole: any,
  ): Promise<Video> {
    let video = await this.videoModel.findById(videoId).exec();
    if (!video) {
      throw new NotFoundException(`Video with ID "${videoId}" not found`);
    }
    const commentIndex = video.comments.findIndex(
      (c) => c._id.toString() === commentId,
    );
    if (commentIndex === -1) {
      throw new NotFoundException('Comment not found');
    }
    if (
      userRole !== 'admin' &&
      video.comments[commentIndex].userId.toString() !== userId
    ) {
      throw new UnauthorizedException(
        'You are not authorized to delete this video',
      );
    }
    video = await this.videoModel
      .findByIdAndUpdate(
        videoId,
        { $pull: { comments: { _id: commentId } } },
        { new: true },
      )
      .exec();

    if (!video) {
      throw new NotFoundException('Video or comment not found');
    }

    return video;
  }

  async getComment(videoId: string, commentId: string): Promise<Comment> {
    const video = await this.videoModel.findById(videoId);
    if (!video) {
      throw new NotFoundException('Video not found');
    }

    const comment = video.comments.find(
      (comment) => comment._id.toString() === commentId,
    );
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return comment;
  }
}
