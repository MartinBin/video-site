import { Controller, Post, Get, Body, Param, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { VideosService } from '../services/videos.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateVideoDto } from '../dto/create-video.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('videos')
@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({summary: 'Create Video'})
  async createVideo(@Body() createVideoDto: CreateVideoDto, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    return this.videosService.createVideo(createVideoDto,file);
  }

  @Get(':id')
  @ApiOperation({summary: 'Get Video by ID'})
  async findVideo(@Param('id') id: string) {
    return this.videosService.findOneVideo(id);
  }

  @Get()
  @ApiOperation({summary: 'Get All Videos'})
  async findAllVideos() {
    return this.videosService.findAllVideos();
  }
}
