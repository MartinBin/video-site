import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Comment{
    @Prop({ required: true })
    content: string;

    @Prop({ type: Types.ObjectId, ref: 'Video', required: true })
    video: Types.ObjectId;

    /*@Prop({ type: Types.ObjectId, ref: 'User', required: true })
    user: Types.ObjectId;*/

    @Prop({ default: 0 })
    likes: number;

    @Prop({ type: String, required: false })
    userDisplayName: string;

    @Prop({ type: Date, default: Date.now })
    createdAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
