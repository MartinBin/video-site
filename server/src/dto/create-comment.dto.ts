import { IsString, IsOptional, IsNumber, IsDate } from 'class-validator';
import { Types } from 'mongoose';
import { Type } from 'class-transformer';

export class CreateCommentDto {
    @IsString()
    content: string;

    @IsOptional()
    @IsNumber()
    likes?: number;

    @IsOptional()
    @IsString()
    userDisplayName?: string;

    @IsDate()
    @Type(() => Date)
    createdAt: Date;

    @IsString()
    video: Types.ObjectId | string;
}
