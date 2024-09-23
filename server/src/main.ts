import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname,'..','uploads'),{
    prefix:'/uploads',
  });
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle("API Documentation")
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('likes')
    .addTag('comments')
    .addTag('videos')
    .build()
  const document = SwaggerModule.createDocument(app,config);
  SwaggerModule.setup('api',app,document);

  await app.listen(3000);
}
bootstrap();
