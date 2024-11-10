import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { Exclude } from 'class-transformer';

export class UpdateVideoDto {
  @ApiProperty({
    description: 'The title of the video',
    example: 'My Awesome Video',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'A description of the video content',
    example: 'This video showcases my latest project',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @Exclude()
  extraProperty: any;
}
