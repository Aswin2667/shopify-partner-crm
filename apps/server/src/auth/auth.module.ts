// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/config/prisma.service';
import { GoogleStrategy } from './google.strategy';
import { AuthController } from './auth.controller';
import { IntegrationService } from 'src/integration/integration.service';
import { IntegrationModule } from '@org/integrations';

@Module({
  imports: [
    PassportModule.register({
      session: true,
    }),
    JwtModule.register({
      secret: 'yourSecretKey',
      signOptions: { expiresIn: '60m' },
    }),
    IntegrationModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    PrismaService,
    GoogleStrategy,
    IntegrationService,
  ],
  //   exports: [AuthService],
})
export class AuthModule {}
