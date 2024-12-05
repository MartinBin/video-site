import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [String], enum: ['admin', 'user', 'guest'], default: ['user'] })
  roles: string[];

  @Prop({ required: false })
  profilePicture?: string;

  @Prop({ required: false })
  refreshToken?: string;

  @Prop({
    type: [
      {
        userId: { type: String, required: true },
        username: { type: String, required: true },
      },
    ],
    default: [],
  })
  subscribers: { userId: string; username: string }[];

  @Prop({
    type: [
      {
        userId: { type: String, required: true },
        username: { type: String, required: true },
      },
    ],
    default: [],
  })
  subscribed: { userId: string; username: string }[];
}
export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
