import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { createClient } from 'redis';

@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async status() {
    const dbOk = await this.prisma.$queryRaw`SELECT 1`;
    let redisOk = false;
    try {
      const client = createClient({ url: process.env.REDIS_URL });
      await client.connect();
      const pong = await client.ping();
      redisOk = pong === 'PONG';
      await client.disconnect();
    } catch {
      redisOk = false;
    }
    return { ok: true, db: !!dbOk, redis: redisOk };
  }
}

