import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Comment, CommentSchema } from '../../comment/schema/comment.schema';
import { User } from '../../user/schema/user.schema';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Video extends Document {
  @ApiProperty({
    description: 'The title of the video.',
    example: 'Sample Video Title',
  })
  @Prop({ required: true })
  title: string;

  @ApiProperty({
    description: 'The description of the video.',
    example: 'This is a detailed description of the video.',
    required: false,
  })
  @Prop({ required: false })
  description?: string;

  @ApiProperty({
    description: 'The URL where the video is hosted.',
    example: 'https://example.com/video.mp4',
  })
  @Prop({ required: true })
  url: string;

  @ApiProperty({
    description: 'The thumbnail image URL for the video.',
    example: 'https://example.com/video-thumbnail.jpg',
  })
  @Prop({ required: true })
  thumbnail: string;

  @ApiProperty({
    description: 'The user who uploaded the video.',
    type: () => User,
  })
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: string;

  @ApiProperty({
    description: 'The list of comments on the video.',
    type: () => [Comment],
    default: [],
  })
  @Prop({ type: [CommentSchema], default: [] })
  comments: Comment[];

  @ApiProperty({
    description: 'The status of the video.',
    example: 'pending',
  })
  @Prop({ default: 'pending' })
  status: string;
}

export type VideoDocument = Video & Document;
export const VideoSchema = SchemaFactory.createForClass(Video);
