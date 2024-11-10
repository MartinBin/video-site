import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLikeDto {
  @ApiProperty({
    description: 'The display name of the user who is creating the like',
    example: 'John Doe',
  })
  @IsString()
  userDisplayName: string;
}
