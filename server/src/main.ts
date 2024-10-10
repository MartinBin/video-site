import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname,'..','uploads'),{
    prefix:'/uploads',
  });
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle("API Documentation")
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('likes')
    .addTag('comments')
    .addTag('videos')
    .build()
  const document = SwaggerModule.createDocument(app,config);
  fs.writeFileSync("./openapi.json", JSON.stringify(document,null,2));
  SwaggerModule.setup('api/docs',app,document);
  await app.listen(3000);
}
bootstrap();
