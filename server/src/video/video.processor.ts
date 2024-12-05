import { Process, Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Job } from 'bull';
import * as ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import { Video } from './schema/video.schema';

@Injectable()
@Processor('video')
export class VideoProcessor {
  constructor(
    @InjectModel(Video.name) private videoModel: Model<Video>,
  ) {}

  @Process('compress')
  async handleVideoCompression(job: Job) {
    const { Id, inputPath, outputPath, originalFileName, compressedFileName, userIdString, videoId } = job.data;

    try {
      await this.videoModel.findByIdAndUpdate(Id, { status: 'processing' });

      await this.compressVideo(inputPath, outputPath);
      console.log("After compression")
      await this.videoModel.findByIdAndUpdate(Id, {
        status: 'completed',
        url: `/uploads/${userIdString}/${videoId}/${compressedFileName}`,
      });
      console.log("Before Deletion")
      fs.unlinkSync(inputPath);
      console.log("After Deletion")
    } catch (error) {
      await this.videoModel.findByIdAndUpdate(Id, { status: 'failed' });
      throw error;
    }
  }

  private async compressVideo(inputPath: string, outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .videoCodec('libx264')
        .outputOptions([
          '-crf 28',
          '-preset medium',
          '-movflags +faststart',
        ])
        .audioCodec('aac')
        .audioBitrate('128k')
        .output(outputPath)
        .on('end', () => resolve())
        .on('error', (err) => {
          console.error('Error during video compression:', err);
          reject(err);
        })
        .run();
    });
  }
}