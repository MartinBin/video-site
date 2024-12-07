import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/schema/user.schema';

@Schema({ timestamps: true })
export class Like extends Document {
  @ApiProperty({
    description: 'The user who liked the content.',
    type: () => User,
  })
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: string;

  @ApiProperty({
    description: 'The display name of the user who liked the content.',
    example: 'JaneDoe',
  })
  @Prop({ type: String, required: true })
  userDisplayName: string;
}

export type LikeDocument = Like & Document;
export const LikeSchema = SchemaFactory.createForClass(Like);
