import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaymentsService } from './payments.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly prisma: PrismaService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('country')
  async getUserCountry(@Req() req: any) {
    // @ts-ignore
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    const country = await this.paymentsService.getUserCountry(ip);
    
    return { country };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('purchase')
  async createPurchase(@Body() data: any, @Req() req: any) {
    // @ts-ignore
    const userId = req.user?.userId;
    
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    // Add user ID to the purchase data
    const purchaseData = {
      ...data,
      userId,
    };
    
    return this.paymentsService.createPurchase(purchaseData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('purchase/:id')
  async getPurchase(@Param('id') id: string) {
    return this.paymentsService.getPurchase(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('purchases')
  async getUserPurchases(@Req() req: any) {
    // @ts-ignore
    const userId = req.user?.userId;
    
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    return this.paymentsService.getUserPurchases(userId);
  }
}