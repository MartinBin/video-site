import { Controller, Post, Get, Body, Param, Patch, Delete, NotFoundException } from '@nestjs/common';
import { VideoCommentsService } from '../services/comments.service';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateCommentDto } from 'src/dto/update-comment.dto';

@ApiTags('comments')
@Controller('videos/:videoId/comments')
export class VideoCommentsController {
  constructor(private readonly videoCommentsService: VideoCommentsService) {}

  @Post()
  @ApiOperation({summary: 'Create comment'})
  @ApiParam({ name: 'videoId', description: 'Video ID' })
  @ApiResponse({ status: 200, description: 'The comment has been successfully created.' })
  @ApiResponse({ status: 404, description: 'Video not found.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiBody({ type: CreateCommentDto })
  createComment(@Param('videoId') videoId: string, @Body() createCommentDto: CreateCommentDto) {
    return this.videoCommentsService.addComment(videoId, createCommentDto);
  }

  @Get()
  @ApiOperation({summary: 'Get all video comments'})
  @ApiParam({ name: 'videoId', description: 'Video ID' })
  @ApiResponse({ status: 200, description: 'The comment has been successfully updated.' })
  getComments(@Param('videoId') videoId: string) {
    return this.videoCommentsService.findAllForVideo(videoId);
  }

  @Patch(':commentId')
  @ApiOperation({ summary: 'Update a comment' })
  @ApiParam({ name: 'videoId', description: 'Video ID' })
  @ApiParam({ name: 'commentId', description: 'Comment ID' })
  @ApiBody({ type: UpdateCommentDto })
  @ApiResponse({ status: 200, description: 'The comment has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Video or comment not found.' })
  async updateComment(
    @Param('videoId') videoId: string,
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto
  ) {
      return await this.videoCommentsService.updateComment(videoId, commentId, updateCommentDto);
  }

  @Delete(':commentId')
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiParam({ name: 'videoId', description: 'Video ID' })
  @ApiParam({ name: 'commentId', description: 'Comment ID' })
  @ApiResponse({ status: 200, description: 'The comment has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Video or comment not found.' })
  async deleteComment(
    @Param('videoId') videoId: string,
    @Param('commentId') commentId: string
  ) {
    try {
      return await this.videoCommentsService.deleteComment(videoId, commentId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('Video not found');
    }
  }

  @Get(':commentId')
  @ApiOperation({summary: 'Get comment by ID'})
  @ApiParam({ name: 'videoId', description: 'Video ID' })
  @ApiParam({ name: 'commentId', description: 'Comment ID' })
  @ApiResponse({ status: 200, description: 'The comment has been successfully retrieved.' })
  @ApiResponse({ status: 404, description: 'Video or comment not found.' })
  async getComment(
    @Param('videoId') videoId: string,
    @Param('commentId') commentId: string
  ) {
    return this.videoCommentsService.getComment(videoId,commentId);
  }
}
