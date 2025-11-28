import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VideoService {
  constructor(private prisma: PrismaService) {}

  async getVideoKey(videoId: string): Promise<string | null> {
    const videoKey = await this.prisma.videoKey.findUnique({
      where: { lessonId: videoId },
    });
    
    return videoKey ? videoKey.key : null;
  }
}