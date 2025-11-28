import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: string) {
    // In a real application, this would fetch a user from the database
    return {
      id: parseInt(id),
      email: 'user@example.com',
      role: 'STUDENT'
    };
  }

  @Post()
  async create(@Body() userData: any) {
    return this.usersService.create(userData);
  }
}