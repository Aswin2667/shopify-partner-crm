import { Injectable } from '@nestjs/common';
import { DateHelper } from '@org/utils';
import { Prisma } from '@prisma/client';
import axios from 'axios';
import { PrismaService } from '@org/data-source'; // Ensure this service is correctly imported

interface GmailIntegrationData {
  googleId: string;
  accessToken: string;
  refreshToken: string | null;
  email: string;
  name: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async handleOAuthCallback(
    code: string,
    organizationId: string,
  ): Promise<{ accessToken: string; refreshToken: string | null }> {
    console.log(code);
    try {
      const integrationExists = await this.prisma.integration.findFirst({
        where: {
          organizationId: organizationId,
          type: 'GMAIL',
        },
      });

      // Exchange code for access token and refresh token
      const tokenResponse = await axios.post(
        'https://oauth2.googleapis.com/token',
        new URLSearchParams({
          code,
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: 'http://localhost:8080/auth/google/callback',
          grant_type: 'authorization_code',
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
      console.log(tokenResponse.data);
      const { access_token, refresh_token, id_token } = tokenResponse.data;

      // Decode ID token to get user info
      const userInfoResponse = await axios.get(
        `https://www.googleapis.com/oauth2/v2/userinfo`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      );

      const { id: googleId, email, name } = userInfoResponse.data;

      if (integrationExists) {
        const existingData =
          integrationExists.data as unknown as GmailIntegrationData;

        return {
          accessToken: access_token,
          refreshToken: existingData.refreshToken ?? null,
        };
      }

      // Store the OAuth data in the Integration model
      // const integration = await this.prisma.integration.create({
      //   data: {
      //     organizationId: organizationId,
      //     data: {
      //       googleId: googleId,
      //       accessToken: access_token,
      //       refreshToken: refresh_token ?? null, // Store null if refresh_token is undefined
      //       email: email,
      //       name: name,
      //     } as unknown as Prisma.JsonValue,
      //     description: `Integration with Gmail for ${email}`,
      //     type: 'GMAIL',
      //     createdAt: DateHelper.getCurrentUnixTime(),
      //     updatedAt: DateHelper.getCurrentUnixTime(),
      //     deletedAt: BigInt(0), // Assuming 0 means not deleted
      //     name: `${name}'s Gmail Integration`,
      //   },
      // });

      // console.log('Integration created:', integration);

      return {
        accessToken: access_token,
        refreshToken: refresh_token ?? null, // Return null if refresh_token is undefined
        //   userId: Number(newUser.id),
      };
    } catch (error) {
      console.error('Error handling OAuth callback:', error);
      throw new Error('Failed to handle OAuth callback');
    }
  }
}
