import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateVideoDto {
    @ApiProperty({
      description: 'The title of the video',
      example: 'My Awesome Video',
      required: true,
    })
    @IsString()
    title: string;

    @ApiProperty({
      description: 'A description of the video content',
      example: 'This video showcases my latest project',
      required: false,
    })
    @IsString()
    @IsOptional()
    description?: string;
  }