import { Module } from '@nestjs/common';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { VideoUploadController } from './video-upload.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VideoController, VideoUploadController],
  providers: [VideoService],
  exports: [VideoService],
})
export class VideoModule {}