import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from '../prisma/prisma.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Queue } from 'bullmq';
import { URL } from 'url';

@Controller('videos')
export class VideoUploadController {
  constructor(private prisma: PrismaService) {}

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('video', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  @Post('upload')
  async uploadVideo(
    @UploadedFile() file: any,
    @Body('lessonId') lessonId: string,
    @Req() req: any,
  ) {
    // @ts-ignore
    const userId = req.user?.userId;
    
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    // Verify user is admin
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (!user || user.role !== 'ADMIN') {
      throw new Error('Unauthorized: Only admins can upload videos');
    }
    
    // Update lesson with temporary file path
    const lesson = await this.prisma.lesson.update({
      where: { id: lessonId },
      data: {
        videoUrl: file.path,
      },
    });

    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    const parsed = new URL(redisUrl);
    const queue = new Queue('videoTranscoding', {
      connection: { host: parsed.hostname, port: Number(parsed.port) || 6379 },
    });
    await queue.add('transcode', { videoId: lessonId, filePath: file.path });
    return lesson;
  }
}
