import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Like, LikeSchema } from '../../like/schema/like.schema';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/schema/user.schema';

@Schema({ timestamps: true })
export class Comment extends Document {
  @ApiProperty({
    description: 'The content of the comment.',
    example: 'This is a comment.',
  })
  @Prop({ required: true })
  content: string;

  @ApiProperty({
    description: 'The user who created the comment.',
    type: () => User,
  })
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: string;

  @ApiProperty({
    description: 'List of likes on the comment.',
    type: () => [Like],
  })
  @Prop({ type: [LikeSchema], default: [] })
  likes: Like[];

  @ApiProperty({
    description: 'The display name of the user who created the comment.',
    example: 'JohnDoe',
    required: false,
  })
  @Prop({ type: String, required: false })
  userDisplayName: string;
}

export type CommentDocument = Comment & Document;
export const CommentSchema = SchemaFactory.createForClass(Comment);
