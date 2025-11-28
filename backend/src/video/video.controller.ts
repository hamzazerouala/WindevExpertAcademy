import {
  Controller,
  Get,
  Param,
  Res,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { VideoService } from './video.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('videos')
export class VideoController {
  constructor(
    private readonly videoService: VideoService,
    private readonly prisma: PrismaService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('key/:videoId')
  async getVideoKey(
    @Param('videoId') videoId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    // Verify the user has access to the course
    // @ts-ignore
    const userId = req.user?.userId;
    
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    
    try {
      // Check if user has access to the course containing this lesson
      const lesson = await this.prisma.lesson.findUnique({
        where: { id: videoId },
        include: {
          section: {
            include: {
              course: true,
            },
          },
        },
      });
      
      if (!lesson) {
        throw new UnauthorizedException('Lesson not found');
      }
      
      // Check access based on course type
      const course = lesson.section.course;
      let hasAccess = false;
      
      switch (course.accessType) {
        case 'FREE':
          // Everyone has access to free courses
          hasAccess = true;
          break;
          
        case 'SUBSCRIPTION':
          // Check if user has an active subscription
          const user = await this.prisma.user.findUnique({
            where: { id: userId },
          });
          
          if (user && user.subscriptionEndsAt && user.subscriptionEndsAt > new Date()) {
            hasAccess = true;
          }
          break;
          
        case 'PREMIUM':
          // Check if user has purchased this specific course
          const purchase = await this.prisma.purchase.findFirst({
            where: {
              userId: userId,
              courseId: course.id,
              status: 'COMPLETED',
            },
          });
          
          if (purchase) {
            hasAccess = true;
          }
          break;
      }
      
      if (!hasAccess) {
        throw new UnauthorizedException('Access denied to this video');
      }
      
      // Get the video key
      const key = await this.videoService.getVideoKey(videoId);
      
      if (!key) {
        throw new UnauthorizedException('Video key not found');
      }
      
      // Decode the base64 key
      const keyBuffer = Buffer.from(key, 'base64');
      
      // Set appropriate headers
      res.setHeader('Content-Type', 'application/octet-stream');
      res.send(keyBuffer);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Unable to retrieve video key');
    }
  }
}