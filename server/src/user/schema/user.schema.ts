import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class User extends Document {
  @ApiProperty({
    description: 'The unique username of the user.',
    example: 'john_doe',
  })
  @Prop({ required: true, unique: true })
  username: string;

  @ApiProperty({
    description: 'The unique email address of the user.',
    example: 'john.doe@example.com',
  })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({
    description: 'The password for the user account.',
    example: 'strongPassword123',
  })
  @Prop({ required: true })
  password: string;

  @ApiProperty({
    description: 'The roles assigned to the user.',
    example: ['user'],
    enum: ['admin', 'user', 'guest'],
    isArray: true,
  })
  @Prop({ type: [String], enum: ['admin', 'user', 'guest'], default: ['user'] })
  roles: string[];

  @ApiProperty({
    description: 'The profile picture URL of the user.',
    example: 'https://example.com/profile.jpg',
    required: false,
  })
  @Prop({ required: false })
  profilePicture?: string;

  @ApiProperty({
    description: 'The refresh token used for generating new access tokens.',
    example: 'refreshTokenString',
    required: false,
  })
  @Prop({ required: false })
  refreshToken?: string;

  @ApiProperty({
    description: 'A list of users who have subscribed to this user.',
    type: () => [Object], // Lazy resolution to break circular dependency
    default: [],
  })
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

  @ApiProperty({
    description: 'A list of users this user has subscribed to.',
    type: () => [Object], // Lazy resolution to break circular dependency
    default: [],
  })
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
