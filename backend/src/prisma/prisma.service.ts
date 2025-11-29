import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);
  private connected = false;

  async onModuleInit() {
    const maxRetries = 10;
    const delayMs = 2000;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.$connect();
        this.connected = true;
        this.logger.log('Connected to database');
        break;
      } catch (error) {
        this.logger.warn(`Database connect attempt ${attempt}/${maxRetries} failed`);
        await new Promise((res) => setTimeout(res, delayMs));
      }
    }
    if (!this.connected) {
      this.logger.error('Failed to connect to database after retries');
    }
  }

  isConnected() {
    return this.connected;
  }
}
