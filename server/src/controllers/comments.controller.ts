import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { VideoCommentsService } from '../services/comments.service';
import { CreateCommentDto } from '../dto/create-comment.dto';


@Controller('videos/:videoId/comments')
export class VideoCommentsController {
  constructor(private readonly videoCommentsService: VideoCommentsService) {}

  @Post()
  createComment(@Param('videoId') videoId: string, @Body() createCommentDto: CreateCommentDto) {
    return this.videoCommentsService.addComment(videoId, createCommentDto);
  }

  @Get()
  getComments(@Param('videoId') videoId: string) {
    return this.videoCommentsService.findAllForVideo(videoId);
  }

  // Other comment-related endpoints...
}
