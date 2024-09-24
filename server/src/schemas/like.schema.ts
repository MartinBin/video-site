import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';

@Schema({ _id: false, timestamps: true })
export class Like {
    /*@Prop({ type: Types.ObjectId, ref: 'User', required: true })
    user: Types.ObjectId;*/

    @Prop({ type: String, required: true })
    userDisplayName: string;

    @Prop({ type: Date, default: Date.now })
    createdAt: Date;
}

export const LikeSchema = SchemaFactory.createForClass(Like);