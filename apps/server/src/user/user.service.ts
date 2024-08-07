import { Injectable, HttpException, HttpStatus, ConsoleLogger } from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import { TokenResponse } from 'google-auth-library/build/src/auth/impersonated';
import { OAuth2Client } from 'google-auth-library/build/src/auth/oauth2client';

const client = new OAuth2Client(
  "639566010681-lt4gkh6lf2v6s6nap66vfvjpueqaqgkm.apps.googleusercontent.com",
 "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"
);

@Injectable()
export class UserService {

  async login(data: Omit<any, "error" | "error_description" | "error_uri">) {
    try {
      console.log(data);
      const user = await client.verifyIdToken({
        idToken: data.access_token,
        audience: "639566010681-lt4gkh6lf2v6s6nap66vfvjpueqaqgkm.apps.googleusercontent.com",
      });

      console.log(user.getPayload());
      return {
        status: true,
        message: 'User created successfully.',
        data: user,
      };
    } catch (error) {
      console.log(error)
      throw new HttpException(
        'Invalid data for user. Please check the provided data.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
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
