import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { createClient } from 'redis';

@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async status() {
    let dbOk = false;
    try {
      if (this.prisma.isConnected && this.prisma.isConnected()) {
        // simple check
        await this.prisma.$queryRaw`SELECT 1`;
        dbOk = true;
      }
    } catch {}
    let redisOk = false;
    let redisError: string | undefined;
    try {
      const client = createClient({ url: process.env.REDIS_URL });
      await client.connect();
      const pong = await client.ping();
      redisOk = pong === 'PONG';
      await client.disconnect();
    } catch (err: any) {
      redisOk = false;
      redisError = err?.message;
    }
    return { ok: true, db: !!dbOk, redis: redisOk, redisError };
  }
}
