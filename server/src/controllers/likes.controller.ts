import { Controller, Post, Delete, Param, Body, Get, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LikesService } from '../services/likes.service';
import { CreateLikeDto } from '../dto/create-like.dto';
@ApiTags('likes')
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post('video/:videoId/comment/:commentId')
  @ApiOperation({ summary: 'Like a comment' })
  @ApiParam({ name: 'videoId', required: true, description: 'ID of the video' })
  @ApiParam({ name: 'commentId', required: true, description: 'ID of the comment to like' })
  @ApiBody({ type: CreateLikeDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The comment has been successfully liked.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Video or comment not found.' })
  async likeComment( 
    @Param('videoId') videoId: string,
    @Param('commentId') commentId: string, 
    @Body() likeDto: CreateLikeDto
  ) {
    return this.likesService.likeComment(videoId, commentId, likeDto);
  }

  @Delete('video/:videoId/comment/:commentId')
  @ApiOperation({ summary: 'Unlike a comment' })
  @ApiParam({ name: 'videoId', required: true, description: 'ID of the video' })
  @ApiParam({ name: 'commentId', required: true, description: 'ID of the comment to unlike' })
  @ApiBody({ type: CreateLikeDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'The comment has been successfully unliked.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Video or comment not found or not liked by the user.' })
  async unlikeComment( 
    @Param('videoId') videoId: string,
    @Param('commentId') commentId: string, 
    @Body() likeDto: CreateLikeDto
  ) {
    return this.likesService.unlikeComment(videoId, commentId, likeDto);
  }

  @Get('video/:videoId/comment/:commentId')
  @ApiOperation({ summary: 'Get like count for a comment' })
  @ApiParam({ name: 'videoId', required: true, description: 'ID of the video' })
  @ApiParam({ name: 'commentId', required: true, description: 'ID of the comment to get like count' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successfully retrieved like count.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Video or comment not found.' })
  async getCommentLikeCount(
    @Param('videoId') videoId: string,
    @Param('commentId') commentId: string
  ) {
    return this.likesService.getLikesCount(videoId, commentId);
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
