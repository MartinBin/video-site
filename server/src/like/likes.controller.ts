import {
  Controller,
  Post,
  Delete,
  Param,
  Body,
  Get,
  HttpStatus,
  BadRequestException, UseGuards, Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { Types } from 'mongoose';
import {AuthGuard} from "@nestjs/passport";
@ApiTags('likes')
@Controller('videos/:videoId/comments/:commentId/likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Like a comment' })
  @ApiParam({ name: 'videoId', required: true, description: 'ID of the video' })
  @ApiParam({
    name: 'commentId',
    required: true,
    description: 'ID of the comment to like',
  })
  @ApiBody({ type: CreateLikeDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The comment has been successfully liked.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Video or comment not found.',
  })
  @ApiResponse({ status: 400, description: 'Invalid ID format.' })
  async likeComment(
    @Param('videoId') videoId: string,
    @Param('commentId') commentId: string,
    @Request() req,
  ) {
    if (!Types.ObjectId.isValid(videoId)) {
      throw new BadRequestException('Invalid videoID format');
    }
    if (!Types.ObjectId.isValid(commentId)) {
      throw new BadRequestException('Invalid commentID format');
    }
    const userId = req.user._id.toString();
    const userName = req.user.username;
    return this.likesService.likeComment(videoId, commentId, userName,userId);
  }

  @Delete(':likeId')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Unlike a comment' })
  @ApiParam({ name: 'videoId', required: true, description: 'ID of the video' })
  @ApiParam({
    name: 'commentId',
    required: true,
    description: 'ID of the comment to unlike',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The comment has been successfully unliked.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Video or comment not found or not liked by the user.',
  })
  @ApiResponse({ status: 400, description: 'Invalid ID format.' })
  async unlikeComment(
    @Param('videoId') videoId: string,
    @Param('commentId') commentId: string,
    @Param('likeId') likeId: string,
    @Request() req,
  ) {
    if (!Types.ObjectId.isValid(videoId)) {
      throw new BadRequestException('Invalid videoID format');
    }
    if (!Types.ObjectId.isValid(commentId)) {
      throw new BadRequestException('Invalid commentID format');
    }
    if (!Types.ObjectId.isValid(likeId)) {
      throw new BadRequestException('Invalid likeID format');
    }
    const userId = req.user._id.toString();
    return this.likesService.unlikeComment(videoId, commentId, likeId, userId);
  }

  @Get('count')
  @ApiOperation({ summary: 'Get like count for a comment' })
  @ApiParam({ name: 'videoId', required: true, description: 'ID of the video' })
  @ApiParam({
    name: 'commentId',
    required: true,
    description: 'ID of the comment to get like count',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved like count.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Video or comment not found.',
  })
  @ApiResponse({ status: 400, description: 'Invalid ID format.' })
  async getCommentLikeCount(
    @Param('videoId') videoId: string,
    @Param('commentId') commentId: string,
  ) {
    if (!Types.ObjectId.isValid(videoId)) {
      throw new BadRequestException('Invalid videoID format');
    }
    if (!Types.ObjectId.isValid(commentId)) {
      throw new BadRequestException('Invalid commentID format');
    }

    return this.likesService.getLikesCount(videoId, commentId);
  }
  @Get()
  @ApiOperation({ summary: 'Get likes of a comment' })
  @ApiParam({ name: 'videoId', required: true, description: 'ID of the video' })
  @ApiParam({
    name: 'commentId',
    required: true,
    description: 'ID of the comment to get like',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved like list.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Video or comment not found.',
  })
  @ApiResponse({ status: 400, description: 'Invalid ID format.' })
  async getCommentLikes(
    @Param('videoId') videoId: string,
    @Param('commentId') commentId: string,
  ) {
    if (!Types.ObjectId.isValid(videoId)) {
      throw new BadRequestException('Invalid videoID format');
    }
    if (!Types.ObjectId.isValid(commentId)) {
      throw new BadRequestException('Invalid commentID format');
    }
    return this.likesService.getLikes(videoId, commentId);
  }
  @Get(':userName')
  @ApiOperation({ summary: 'Get like of comment by username' })
  @ApiParam({ name: 'videoId', required: true, description: 'ID of the video' })
  @ApiParam({
    name: 'commentId',
    required: true,
    description: 'ID of the comment',
  })
  @ApiParam({
    name: 'userName',
    required: true,
    description: 'Name of the user to get like',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved like.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Video or comment not found.',
  })
  @ApiResponse({ status: 400, description: 'Invalid ID format.' })
  async getCommentLikesByUsername(
    @Param('videoId') videoId: string,
    @Param('commentId') commentId: string,
    @Param('userName') userName: string,
  ) {
    if (!Types.ObjectId.isValid(videoId)) {
      throw new BadRequestException('Invalid videoID format');
    }
    if (!Types.ObjectId.isValid(commentId)) {
      throw new BadRequestException('Invalid commentID format');
    }
    return this.likesService.getLikesByUsername(videoId, commentId, userName);
  }

  /*@Post('video/:videoId')
  async likeVideo(@Param('videoId') videoId: string, @Request() req) {
    const userId = req.user.userId;
    return this.likesService.addVideoLike(videoId, userId);
  }

  @Delete('video/:videoId')
  async unlikeVideo(@Param('videoId') videoId: string, @Request() req) {
    const userId = req.user.userId;
    return this.likesService.removeVideoLike(videoId, userId);
  }*/
}
