import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateVideoDto } from 'src/video/dto/create-video.dto';
import { Video } from './schema/video.schema';
import * as fs from 'fs';
import * as path from 'path';
import { UpdateVideoDto } from 'src/video/dto/update-video.dto';
import { UsersService } from 'src/user/users.service';

@Injectable()
export class VideosService {
    constructor(@InjectModel(Video.name) private videoModel: Model<Video>,
    private usersService: UsersService) {}
    createVideo(createVideoDto: CreateVideoDto, file: Express.Multer.File, userId: string): Promise<Video>{
        const fileName=`${Date.now()}+${file.originalname}`;
        const filePath=path.join(__dirname, '..','..','uploads',fileName);

        if(!fs.existsSync(path.dirname(filePath))){
            fs.mkdirSync(path.dirname(filePath),{recursive:true});
        }
        fs.writeFileSync(filePath,file.buffer);
        const newVideo = new this.videoModel({
            ...createVideoDto,
            userId: userId,
            url:`/uploads/${fileName}`,
        });
        return newVideo.save();
    }

    async findOneVideo(id:string){
        const foundVideo = await this.videoModel.findById(id).exec();
        if(!foundVideo){
            throw new NotFoundException(`Video with ID "${id}" not found`);
        }
        const user = await this.usersService.findById(foundVideo.userId)
        return {foundVideo, userName: user.username};
    }
    findAllVideos(){
        return this.videoModel.find().exec();
    }

    async updateVideo(id:string, updateVideo:UpdateVideoDto){
        const updatedVideo=await this.videoModel.findByIdAndUpdate(
            id,
            {$set: updateVideo},
            {new:true,runValidators: true}
        );

        if(!updatedVideo){
            throw new NotFoundException(`Video with ID "${id}" not found`);
        }
        return updatedVideo;
    }

    async deleteVideo(id:string){
        const deletedVideo = await this.videoModel.findByIdAndDelete(id).exec();
        if (!deletedVideo) {
            throw new NotFoundException(`Video with ID "${id}" not found`);
        }
        
        if (deletedVideo.url){
            const filePath = path.join(__dirname,'..','..',deletedVideo.url);
            if(fs.existsSync(filePath)){
                fs.unlinkSync(filePath);
            }
        }
        return deletedVideo;
    }
}
