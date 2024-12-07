import {
  BadRequestException,
  Body,
  Controller, Delete,
  Get,
  Param,
  Post,
  Put,
  Request, UnauthorizedException,
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
import {Types} from "mongoose";
import {Video} from "../video/schema/video.schema";

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly videosService: VideosService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get the currently logged-in user\'s details' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved user details', type: User })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUser(@Request() req) {
    const userId = req.user._id.toString();
    return await this.usersService.getUserById(userId, { includeRole: true });
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved all users', type: [User] })
  async getAll() {
    return await this.usersService.getAllUsers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'The user ID' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved user details', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(@Param('id') id: string) {
    return await this.usersService.getUserById(id);
  }

  @Get(':id/video')
  @ApiOperation({ summary: 'Get videos uploaded by a user' })
  @ApiParam({ name: 'id', description: 'The user ID' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved videos', type: [Video] })
  @ApiResponse({ status: 404, description: 'User or videos not found' })
  async getVideo(@Param('id') id: string) {
    return await this.videosService.getVideoByUserId(id);
  }

  @Post(':id/subscribe')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Subscribe to a user' })
  @ApiParam({ name: 'id', description: 'The user ID to subscribe to' })
  @ApiResponse({ status: 200, description: 'Successfully subscribed to user' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async subscribeToUser(@Param('id') id:string, @Request() req){
    return await this.usersService.subscribeUser(req.user._id.toString(),id);
  }

  @Post(':id/unsubscribe')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Unsubscribe from a user' })
  @ApiParam({ name: 'id', description: 'The user ID to unsubscribe from' })
  @ApiResponse({ status: 200, description: 'Successfully unsubscribed from user' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async unsubscribeToUser(@Param('id') id:string, @Request() req){
    return await this.usersService.unsubscibeUser(req.user._id.toString(),id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'The user ID to delete' })
  @ApiResponse({ status: 200, description: 'Successfully deleted the user' })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid ID format' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteUser(@Param('id') id:string, @Request() req){
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    const userId = req.user._id.toString();
    let userRole ="user";
    if(req.user.roles.includes('admin')){
      userRole= "admin";
    }
    return await this.usersService.deleteUser(id,userId,userRole);
  }
}
