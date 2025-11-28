import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.course.findMany({
      include: {
        sections: {
          include: {
            lessons: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.course.findUnique({
      where: { id },
      include: {
        sections: {
          include: {
            lessons: true,
          },
        },
      },
    });
  }

  async create(data: any) {
    return this.prisma.course.create({
      data,
    });
  }

  async update(id: string, data: any) {
    return this.prisma.course.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.course.delete({
      where: { id },
    });
  }
}