import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // if (!user) {
    //   throw new UnauthorizedException('User not authenticated.');
    // }

    // const isAdmin = user.role === 'ADMIN';
    // if (!isAdmin) {
    //   throw new UnauthorizedException('Only admin can perform this action.');
    // }

    return true;
  }
}
