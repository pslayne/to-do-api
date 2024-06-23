import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUser, UserDTO, UsersService } from './users.service';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiResponse, PartialType, PickType } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('/signup')
  @ApiCreatedResponse({description: "user created"}) 
  @ApiBadRequestResponse({description: "missing fields or taken username"})
  async signUp(@Body() user: CreateUser) {
    return await this.userService.createUser(user);
  }

  @Get()
  @ApiResponse({
    isArray: true,
    type: PickType(UserDTO, ['id', 'name'] as const),
    status: 200
  })
  async getAll() {
    return await this.userService.list();
  }
}