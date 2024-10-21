import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';
import { Like, LikeSchema } from './like.schema';
import { ApiProperty } from "@nestjs/swagger";
import { User } from './user.schema';

@Schema({ timestamps: true })
export class Comment extends Document{

    @Prop({ required: true })
    @ApiProperty({description: 'Comment text'})
    content: string;

    @Prop({ type: Types.ObjectId, ref: 'Video', required: true })
    @ApiProperty({description: 'ID of the video where comment is created'})
    video: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    userId: string;

    @Prop({ type: [LikeSchema] })
    @ApiProperty({description: 'Likes for comment'})
    likes: Like[];

    @Prop({ type: String, required: false })
    @ApiProperty({description: 'Users username of who created the comment'})
    userDisplayName: string;
}
export type CommentDocument = Comment & Document;
export const CommentSchema = SchemaFactory.createForClass(Comment);
