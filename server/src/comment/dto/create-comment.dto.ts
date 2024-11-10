import { IsString, IsOptional, IsNumber, IsDate } from 'class-validator';
import { Types } from 'mongoose';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: 'The content of the comment',
    example: 'This is a great video!',
  })
  @IsString()
  content: string;

  @ApiPropertyOptional({
    description: 'The display name of the user who posted the comment',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  userDisplayName?: string;

  @ApiProperty({
    description: 'The date and time when the comment was created',
    example: '2023-04-21T12:00:00Z',
  })
  @IsDate()
  @Type(() => Date)
  createdAt: Date;
}
