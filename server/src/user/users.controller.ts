import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { LoginUserDto } from 'src/auth/dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './schema/user.schema';
import { VideosService } from '../video/videos.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly videosService: VideosService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getUser(@Request() req) {
    const userId = req.user._id.toString();
    return await this.usersService.getUserById(userId);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return await this.usersService.getUserById(id);
  }

  @Get(':id/video')
  async getVideo(@Param('id') id: string) {
    return await this.videosService.getVideoByUserId(id);
  }
}
