import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Comment, CommentSchema } from '../../comment/schema/comment.schema';
import { User } from '../../user/schema/user.schema';

@Schema()
export class Video extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ required: true })
  url: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: string;

  @Prop({ type: [CommentSchema], default: [] })
  comments: Comment[];
}
export type VideoDocument = Video & Document;
export const VideoSchema = SchemaFactory.createForClass(Video);
