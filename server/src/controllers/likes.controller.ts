import { Controller, Post, Delete, Param, UseGuards, Request, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { LikesService } from '../services/likes.service';

@ApiTags('likes')
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post('comment/:commentId')
  @ApiOperation({ summary: 'Like a comment' })
  @ApiParam({ name: 'commentId', required: true, description: 'ID of the comment to like' })
  async likeComment(@Param('commentId') commentId: string, @Request() req) {
    const userId = req.user.userId;
    return this.likesService.likeComment(commentId, userId);
  }

  @Delete('comment/:commentId')
  @ApiOperation({ summary: 'Unlike a comment' })
    @ApiParam({ name: 'commentId', required: true, description: 'ID of the comment to unlike' })
  async unlikeComment(@Param('commentId') commentId: string, @Request() req) {
    const userId = req.user.userId;
    return this.likesService.unlikeComment(commentId, userId);
  }

  @Get('comment/:commentId')
  @ApiOperation({ summary: 'Get like count for a comment' })
  @ApiParam({ name: 'commentId', required: true, description: 'ID of the comment to get like count' })
  async getCommentLikeCount(@Param('commentId') commentId: string){
    return this.likesService.getLikesCount(commentId);
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
