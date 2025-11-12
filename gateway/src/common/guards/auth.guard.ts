import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    // For simplicity, a basic token check. In a real app, this would involve JWT verification.
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No authorization token provided');
    }
    const token = authHeader.split(' ')[1];
    // Here, you would typically verify the JWT token with a secret key
    // For now, we'll just check if a token exists.
    if (token) {
      // In a real application, decode and validate the token
      // For example: jwt.verify(token, process.env.JWT_SECRET);
      request.user = { userId: 'mock_user_id' }; // Attach user info to request
      return true;
    }
    throw new UnauthorizedException('Invalid token');
  }
}
