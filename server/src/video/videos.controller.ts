import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Patch,
  Delete,
  UsePipes,
  UseGuards,
  Req,
  Query,
  Request, UploadedFiles,
} from '@nestjs/common';
import { VideosService } from './videos.service';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateVideoDto } from './dto/create-video.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateVideoDto } from 'src/video/dto/update-video.dto';
import { Types } from 'mongoose';
import { StrictValidationPipe } from '../pipes/strict-validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@ApiTags('videos')
@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}
  
  @Get('search')
  async searchVideos(@Query('query') query: string) {
    if (!query) {
      return [];
    }
    return this.videosService.searchVideos(query); 
  }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'video', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 },
    ])
  )
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOperation({ summary: 'Create Video' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateVideoDto })
  @ApiResponse({
    status: 201,
    description: 'The video has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @Roles('user', 'admin')
  async createVideo(
    @Body() createVideoDto: CreateVideoDto,
    @UploadedFiles()
  files: {
    video?: Express.Multer.File[];
    thumbnail?: Express.Multer.File[];
  },
    @Request() req,
  ) {
    if (!files.video?.[0]) {
      throw new BadRequestException('Video file is required');
    }
  
    if (!files.thumbnail?.[0]) {
      throw new BadRequestException('Thumbnail file is required');
    }
  
    const video = files.video[0];
    const thumbnail = files.thumbnail[0];
  
    const allowedMimeTypes = [
      'video/mp4',
      'video/mpeg',
      'video/quicktime',
      'video/x-msvideo',
    ];
  
    if (!allowedMimeTypes.includes(video.mimetype)) {
      throw new BadRequestException('Invalid video file type. Only video files are allowed.');
    }
  
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedImageTypes.includes(thumbnail.mimetype)) {
      throw new BadRequestException('Invalid thumbnail file type. Only image files are allowed.');
    }
  
    const userId = req.user._id;
  
    return await this.videosService.createVideo(createVideoDto, video, thumbnail, userId);
  }

  @Get(':id/status')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get video processing status' })
  @ApiParam({ name: 'id', description: 'Video ID' })
  @ApiResponse({
    status: 200,
    description: 'Video processing status retrieved.',
  })
  @ApiResponse({ status: 404, description: 'Video not found.' })
  async getVideoStatus(@Param('id') id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    const video = await this.videosService.findOneVideo(id);
    return { status: video.foundVideo.status };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Video by ID' })
  @ApiParam({ name: 'id', description: 'Video ID' })
  @ApiResponse({
    status: 200,
    description: 'The video has been successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'Video not found.' })
  @ApiResponse({ status: 400, description: 'Invalid ID format.' })
  async findVideo(@Param('id') id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    return this.videosService.findOneVideo(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get All Videos' })
  @ApiResponse({ status: 200, description: 'List of all videos.' })
  async findAllVideos() {
    return this.videosService.findAllVideos();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update video' })
  @ApiParam({ name: 'id', description: 'Video ID' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBody({ type: UpdateVideoDto })
  @ApiResponse({
    status: 200,
    description: 'The video has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Video not found.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @UsePipes(new StrictValidationPipe())
  async updateVideo(
    @Param('id') id: string,
    @Body() updateVideo: UpdateVideoDto,
    @Request() req,
  ) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    const userId = req.user._id.toString();
    const userRole = req.user.roles[0];
    return this.videosService.updateVideo(id, updateVideo, userId, userRole);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Delete video with content' })
  @ApiParam({ name: 'id', description: 'Video ID' })
  @ApiResponse({
    status: 200,
    description: 'The video has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Video not found.' })
  @ApiResponse({ status: 400, description: 'Invalid ID format.' })
  async deleteVideo(@Param('id') id: string, @Request() req) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    const userId = req.user._id.toString();
    const userRole = req.user.roles[0];
    return this.videosService.deleteVideo(id, userId, userRole);
  }

}
