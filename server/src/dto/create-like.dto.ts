import { IsString, IsOptional, IsNumber, IsDate } from 'class-validator';
import { Types } from 'mongoose';
import { Type } from 'class-transformer';

export class CreateLikeDto {
    @IsString()
    userDisplayName: string;

    @IsDate()
    @Type(() => Date)
    createdAt: Date;
}