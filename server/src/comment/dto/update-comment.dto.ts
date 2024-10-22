import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({
    description: 'The updated content of the comment',
    example: 'This is an updated comment',
    required: false,
  })
  @IsString()
  @IsOptional()
  content?: string;
}
