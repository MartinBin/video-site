import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';
import { Comment, CommentSchema } from './comment.schema';

@Schema()
export class Video{

    @Prop({ required:true})
    title: string;

    @Prop({required:false})
    description?: string;

    @Prop({ required:true})
    url: string;

    @Prop({ type: [CommentSchema], default: [] })
    comments: Comment[];
    
    @Prop({ unique: true, default: () => Date.now().toString(36) + Math.random().toString(36).substr(2, 5) })
    videoId: string;
}
export type VideoDocument = Video & Document;
export const VideoSchema = SchemaFactory.createForClass(Video);