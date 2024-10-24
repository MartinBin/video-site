
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

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


    @Prop({ type: [String], default: [] })
    subscribers: string[];

    @Prop({ type: [String], default: [] })
    subscribed: string[];

}
export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
