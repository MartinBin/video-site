import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from '../schemas/comment.schema';

@Injectable()
export class LikesService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>
  ) {}

  async likeComment(commentId: string, userId: string): Promise<Comment> {
    return this.commentModel.findByIdAndUpdate(
      commentId,
      { $addToSet: { likes: userId } },
      { new: true, runValidators: true }
    ).exec();
  }

  async unlikeComment(commentId: string, userId: string): Promise<Comment> {
    return this.commentModel.findByIdAndUpdate(
      commentId,
      { $pull: { likes: userId } },
      { new: true }
    ).exec();
  }

  async getLikesCount(commentId: string): Promise<number> {
    const comment = await this.commentModel.findById(commentId).exec();
    return comment?.likes?.length || 0;
  }
}
