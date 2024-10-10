import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';

@Schema({timestamps: true })
export class Like extends Document {
    /*@Prop({ type: Types.ObjectId, ref: 'User', required: true })
    user: Types.ObjectId;*/

    @Prop({ type: String, required: true })
    userDisplayName: string;
}
export type LikeDocument = Like & Document;
export const LikeSchema = SchemaFactory.createForClass(Like);