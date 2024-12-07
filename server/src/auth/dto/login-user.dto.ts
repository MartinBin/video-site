import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEmail,
} from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: 'The email address of the user.',
    example: 'johndoe@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password for the user account.',
    example: 'StrongPassword123!',
  })
  @IsNotEmpty()
  password: string;
}
