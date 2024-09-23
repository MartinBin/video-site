import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateVideoDto } from 'src/dto/create-video.dto';
import { Video } from 'src/schemas/video.schema';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class VideosService {
    constructor(@InjectModel(Video.name) private videoModel: Model<Video>) {}
    createVideo(createVideoDto: CreateVideoDto, file: Express.Multer.File): Promise<Video>{
        const fileName=`${Date.now()}+${file.originalname}`;
        const filePath=path.join(__dirname, '..','..','uploads',fileName);

        if(!fs.existsSync(path.dirname(filePath))){
            fs.mkdirSync(path.dirname(filePath),{recursive:true});
        }
        fs.writeFileSync(filePath,file.buffer);

        const newVideo = new this.videoModel({
            ...createVideoDto,
            url:`/uploads/${fileName}`,
        });
        return newVideo.save();
    }

    findOneVideo(id:string){
        return this.videoModel.findById(id).exec();
    }
    findAllVideos(){
        return this.videoModel;
    }
}
