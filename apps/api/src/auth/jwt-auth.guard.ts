import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);
    if (!token) {
      throw new UnauthorizedException("Missing bearer token");
    }
    request.user = await this.authService.verifyToken(token);
    return true;
  }

  private extractToken(request: { headers?: Record<string, string> }): string | null {
    const header = request.headers?.authorization || "";
    const [scheme, value] = header.split(" ");
    if (scheme !== "Bearer" || !value) {
      return null;
    }
    return value;
  }
}
