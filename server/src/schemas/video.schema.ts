import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';
import { Comment, CommentSchema } from './comment.schema';

@Schema()
export class Video extends Document{

    @Prop({ required:true})
    title: string;

    @Prop({required:false})
    description?: string;

    @Prop({ required:true})
    url: string;

    @Prop({ type: [CommentSchema], default: [] })
    comments: Comment[];
}
export type VideoDocument = Video & Document;
export const VideoSchema = SchemaFactory.createForClass(Video);