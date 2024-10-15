import { Controller, Post, Get, Body, Param, UploadedFile, UseInterceptors, BadRequestException, Patch, Delete, UsePipes } from '@nestjs/common';
import { VideosService } from '../services/videos.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateVideoDto } from '../dto/create-video.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateVideoDto } from 'src/dto/update-video.dto';
import { Types } from 'mongoose';
import { StrictValidationPipe } from '../pipes/strict-validation.pipe';

@ApiTags('videos')
@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({summary: 'Create Video'})
  @ApiConsumes('multipart/form-data')
  @ApiBody({type:CreateVideoDto})
  @ApiResponse({ status: 201, description: 'The video has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async createVideo(@Body() createVideoDto: CreateVideoDto, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const allowedMimeTypes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only video files are allowed.');
    }

    return this.videosService.createVideo(createVideoDto,file);
  }

  @Get(':id')
  @ApiOperation({summary: 'Get Video by ID'})
  @ApiParam({ name: 'id', description: 'Video ID' })
  @ApiResponse({ status: 200, description: 'The video has been successfully retrieved.' })
  @ApiResponse({ status: 404, description: 'Video not found.' })
  @ApiResponse({ status: 400, description: 'Invalid ID format.' })
  async findVideo(@Param('id') id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    return this.videosService.findOneVideo(id);
  }

  @Get()
  @ApiOperation({summary: 'Get All Videos'})
  @ApiResponse({ status: 200, description: 'List of all videos.' })
  async findAllVideos() {
    return this.videosService.findAllVideos();
  }

  @Patch(':id')
  @ApiOperation({ summary: "Update video" })
  @ApiParam({ name: 'id', description: 'Video ID' })
  @ApiBody({ type: UpdateVideoDto })
  @ApiResponse({ status: 200, description: 'The video has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Video not found.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @UsePipes(new StrictValidationPipe())
  async updateVideo(@Param('id') id: string, @Body() updateVideo: UpdateVideoDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    return this.videosService.updateVideo(id, updateVideo);
  }

  @Delete(':id')
  @ApiOperation({ summary: "Delete video with content" })
  @ApiParam({ name: 'id', description: 'Video ID' })
  @ApiResponse({ status: 200, description: 'The video has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Video not found.' })
  @ApiResponse({ status: 400, description: 'Invalid ID format.' })
  async deleteVideo(@Param('id') id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    return this.videosService.deleteVideo(id);
  }
}
