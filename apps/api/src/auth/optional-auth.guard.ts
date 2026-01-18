import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Injectable()
export class OptionalAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);
    if (!token) {
      request.user = null;
      return true;
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
