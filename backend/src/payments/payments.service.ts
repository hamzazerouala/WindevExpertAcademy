import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async getUserCountry(ip: string): Promise<string> {
    // In a real implementation, you would use a geolocation service
    // For now, we'll return a default country
    // You could integrate with services like MaxMind, IPinfo, or ip-api.com
    
    // For demonstration purposes, we'll return 'DZ' for Algeria
    // In a real app, you would parse the IP and determine the country
    return 'DZ';
  }

  async createPurchase(data: any) {
    return this.prisma.purchase.create({
      data,
    });
  }

  async updatePurchase(id: string, data: any) {
    return this.prisma.purchase.update({
      where: { id },
      data,
    });
  }

  async getPurchase(id: string) {
    return this.prisma.purchase.findUnique({
      where: { id },
    });
  }

  async getUserPurchases(userId: string) {
    return this.prisma.purchase.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}