import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Patch,
  Delete,
  NotFoundException,
  BadRequestException,
  Request,
  UseGuards,
} from '@nestjs/common';
import { VideoCommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateCommentDto } from 'src/comment/dto/update-comment.dto';
import { Types } from 'mongoose';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('comments')
@Controller('videos/:videoId/comments')
export class VideoCommentsController {
  constructor(private readonly videoCommentsService: VideoCommentsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create comment' })
  @ApiParam({ name: 'videoId', description: 'Video ID' })
  @ApiResponse({
    status: 200,
    description: 'The comment has been successfully created.',
  })
  @ApiResponse({ status: 404, description: 'Video not found.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiBody({ type: CreateCommentDto })
  createComment(
    @Param('videoId') videoId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Request() req,
  ) {
    if (!Types.ObjectId.isValid(videoId)) {
      throw new BadRequestException('Invalid ID format');
    }
    const userId = req.user._id.toString();
    return this.videoCommentsService.addComment(
      videoId,
      createCommentDto,
      userId,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all video comments' })
  @ApiParam({ name: 'videoId', description: 'Video ID' })
  @ApiResponse({
    status: 200,
    description: 'The comment has been successfully updated.',
  })
  @ApiResponse({ status: 400, description: 'Invalid ID format.' })
  getComments(@Param('videoId') videoId: string) {
    if (!Types.ObjectId.isValid(videoId)) {
      throw new BadRequestException('Invalid ID format');
    }
    return this.videoCommentsService.findAllForVideo(videoId);
  }

  @Patch(':commentId')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Update a comment' })
  @ApiParam({ name: 'videoId', description: 'Video ID' })
  @ApiParam({ name: 'commentId', description: 'Comment ID' })
  @ApiBody({ type: UpdateCommentDto })
  @ApiResponse({
    status: 200,
    description: 'The comment has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Video or comment not found.' })
  @ApiResponse({ status: 400, description: 'Invalid ID format.' })
  async updateComment(
    @Param('videoId') videoId: string,
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Request() req,
  ) {
    if (!Types.ObjectId.isValid(videoId)) {
      throw new BadRequestException('Invalid videoID format');
    }
    if (!Types.ObjectId.isValid(commentId)) {
      throw new BadRequestException('Invalid commentID format');
    }
    const userId = req.user._id.toString();
    return await this.videoCommentsService.updateComment(
      videoId,
      commentId,
      updateCommentDto,
      userId,
    );
  }

  @Delete(':commentId')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiParam({ name: 'videoId', description: 'Video ID' })
  @ApiParam({ name: 'commentId', description: 'Comment ID' })
  @ApiResponse({
    status: 200,
    description: 'The comment has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Video or comment not found.' })
  @ApiResponse({ status: 400, description: 'Invalid ID format.' })
  async deleteComment(
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
    const userRole = req.user.roles[0];
    return await this.videoCommentsService.deleteComment(
      videoId,
      commentId,
      userId,
      userRole,
    );
  }

  @Get(':commentId')
  @ApiOperation({ summary: 'Get comment by ID' })
  @ApiParam({ name: 'videoId', description: 'Video ID' })
  @ApiParam({ name: 'commentId', description: 'Comment ID' })
  @ApiResponse({
    status: 200,
    description: 'The comment has been successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'Video or comment not found.' })
  @ApiResponse({ status: 400, description: 'Invalid ID format.' })
  async getComment(
    @Param('videoId') videoId: string,
    @Param('commentId') commentId: string,
  ) {
    if (!Types.ObjectId.isValid(videoId)) {
      throw new BadRequestException('Invalid videoID format');
    }
    if (!Types.ObjectId.isValid(commentId)) {
      throw new BadRequestException('Invalid commentID format');
    }
    return this.videoCommentsService.getComment(videoId, commentId);
  }
}
