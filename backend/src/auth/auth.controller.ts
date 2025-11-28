import { Controller, Post, UseGuards, Req, HttpCode, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import type { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(200)
  async login(@Req() req: Request) {
    // @ts-ignore
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() userData: any) {
    return this.authService.register(userData);
  }
}