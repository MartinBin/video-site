import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { VideoCommentsService } from '../services/comments.service';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('comments')
@Controller('comments')
export class VideoCommentsController {
  constructor(private readonly videoCommentsService: VideoCommentsService) {}

  @Post(':videoId')
  @ApiOperation({summary: 'Create comment'})
  createComment(@Param('videoId') videoId: string, @Body() createCommentDto: CreateCommentDto) {
    return this.videoCommentsService.addComment(videoId, createCommentDto);
  }

  @Get(':videoId')
  @ApiOperation({summary: 'Get all video comments'})
  getComments(@Param('videoId') videoId: string) {
    return this.videoCommentsService.findAllForVideo(videoId);
  }

  @Get()
  @ApiOperation({summary: 'Get all comments'})
  getAllComments() {
    return this.videoCommentsService.findAll();
  }

  // Other comment-related endpoints...
}
