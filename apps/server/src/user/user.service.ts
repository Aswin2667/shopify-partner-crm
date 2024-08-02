import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  async create(userDto: CreateUserDto) {
    try {
      const user = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        authenticationMethod: 'GOOGLE',
      };
      return user;
    } catch (error) {
      throw new HttpException(
        'Invalid data for user. Please check the provided data.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async delete(id: string) {
    try {
      return {
        status: true,
        message: 'User deleted successfully.',
      };
    } catch (error) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }
  }

  async update(id: string, userDto: CreateUserDto) {
    try {
      const user = {
        status: true,
        message: 'User name updated successfully.',
        data: { id: '1', name: 'Jane Doe' },
      };
      return user;
    } catch (error) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }
  }

  async findOne(id: string) {
    try {
      const user = {
        status: true,
        message: 'User retrieved successfully.',
        data: { id: '1', name: 'John Doe' },
      };
      return user;
    } catch (error) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }
  }
}
