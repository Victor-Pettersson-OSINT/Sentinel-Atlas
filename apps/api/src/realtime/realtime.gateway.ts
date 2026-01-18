import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from "@nestjs/websockets";
import type { Server, Socket } from "socket.io";
import { AuthService } from "../auth/auth.service";
import type { AuthUser } from "../auth/auth.types";

@WebSocketGateway({ cors: true })
export class RealtimeGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly authService: AuthService) {}

  async handleConnection(client: Socket) {
    const token = this.extractToken(client);
    if (!token) {
      client.data.user = { roles: ["anonymous"] };
      return;
    }
    try {
      const user = await this.authService.verifyToken(token);
      client.data.user = user;
    } catch (error) {
      client.data.user = { roles: ["anonymous"] };
    }
  }

  broadcast(event: string, payload: Record<string, unknown>) {
    for (const socket of this.server.sockets.sockets.values()) {
      if (this.canReceive(socket, payload)) {
        socket.emit(event, payload);
      }
    }
  }

  private canReceive(socket: Socket, payload: Record<string, unknown>) {
    const user = socket.data.user as AuthUser | undefined;
    if (!user?.roles) {
      return (payload.status as string) === "approved";
    }
    if (user.roles.includes("global_manager")) {
      return true;
    }
    if (user.roles.includes("regional_manager") && user.regions?.length) {
      return user.regions.includes(String(payload.regionId ?? ""));
    }
    if (
      user.roles.includes("nordic_manager") ||
      user.roles.includes("european_manager")
    ) {
      return true;
    }
    return (payload.status as string) === "approved";
  }

  private extractToken(client: Socket): string | null {
    const authHeader =
      (client.handshake.headers.authorization as string | undefined) ?? "";
    if (authHeader.startsWith("Bearer ")) {
      return authHeader.slice(7);
    }
    const token = client.handshake.auth?.token as string | undefined;
    return token ?? null;
  }
}
