import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VideoModule } from './video/videos.module';
import { CommentModule } from './comment/comments.module';
import { MulterModule } from '@nestjs/platform-express';
import { LikesModule } from './like/likes.module';
import { UsersModule } from './user/users.module';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';

dotenv.config();

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          //password: configService.get<string>('REDIS_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    VideoModule,
    CommentModule,
    LikesModule,
    UsersModule,
    AuthModule,
    MulterModule.register({
      dest: './uploads',
      limits: {
        fileSize: 1073741824, // 500MB in bytes
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
