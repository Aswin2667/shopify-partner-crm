import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class MagicLinkService {
  async sendMagicLink(email: string): Promise<string> {
    try {
      return email;
    } catch (error) {
      throw new HttpException(
        'An unexpected error occurred while sending the magic link.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async verifyToken(token: string): Promise<any> {
    try {
      // Logic to verify the magic token
      // E.g., decode token and check its validity
      // Return user details if token is valid
      return {
        id: 'ck2j49r2a0d1m0741gzhjo41v',
        name: 'John Doe',
        email: 'example@gmail.com',
        authenticationMethod: 'MAGIC_LINK',
        createdAt: 872748344,
        deletedAt: 124234123,
      };
    } catch (error) {
      throw new HttpException(
        'An unexpected error occurred while verifying the token.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
