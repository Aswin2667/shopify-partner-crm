import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { ServerResponse } from 'http';
import { TokenResponse } from 'google-auth-library/build/src/auth/impersonated';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/login')
  async createUser(
    @Body()
    createUser: Omit<
      TokenResponse,
      'error' | 'error_description' | 'error_uri'
    >,
  ) {
    console.log(createUser);
    return this.userService.create(createUser);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    try {
      return await this.userService.delete(id);
    } catch (error) {
      throw new HttpException(
        error.message || 'An unexpected error occurred.',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const user = await this.userService.update(id, updateUserDto);
      return user;
    } catch (error) {
      throw new HttpException(
        error.message || 'An unexpected error occurred.',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    try {
      const user = await this.userService.findOne(id);
      return user;
    } catch (error) {
      throw new HttpException(
        error.message || 'An unexpected error occurred.',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
