import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../user/schema/user.schema';

@Schema({ timestamps: true })
export class Like extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  userDisplayName: string;
}
export type LikeDocument = Like & Document;
export const LikeSchema = SchemaFactory.createForClass(Like);
