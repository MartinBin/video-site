import { Controller, Post, Get, Body, Param, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { VideosService } from '../services/videos.service';

import { CreateVideoDto } from '../dto/create-video.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createVideo(@Body() createVideoDto: CreateVideoDto, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    return this.videosService.createVideo(createVideoDto,file);
  }

  @Get(':id')
  async findVideo(@Param('id') id: string) {
    return this.videosService.findOneVideo(id);
  }

  @Get()
  async findAllVideos() {
    return this.videosService.findAllVideos();
  }
}
