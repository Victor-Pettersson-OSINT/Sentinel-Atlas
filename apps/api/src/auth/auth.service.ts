import { Injectable } from "@nestjs/common";
import jwt, { JwtHeader } from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import type { AuthUser } from "./auth.types";

@Injectable()
export class AuthService {
  private client = jwksClient({
    jwksUri: `${process.env.AUTH0_ISSUER}.well-known/jwks.json`,
    cache: true,
    rateLimit: true,
  });

  private getKey(header: JwtHeader): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!header.kid) {
        reject(new Error("Missing kid in JWT header"));
        return;
      }
      this.client.getSigningKey(header.kid, (err, key) => {
        if (err || !key) {
          reject(err || new Error("Signing key not found"));
          return;
        }
        resolve(key.getPublicKey());
      });
    });
  }

  async verifyToken(token: string): Promise<AuthUser> {
    const issuer = process.env.AUTH0_ISSUER;
    const audience = process.env.AUTH0_AUDIENCE;
    const rolesClaim =
      process.env.AUTH0_ROLES_CLAIM ?? "https://sentinel-atlas/roles";
    const regionClaim =
      process.env.AUTH0_REGION_CLAIM ?? "https://sentinel-atlas/regions";

    if (!issuer || !audience) {
      throw new Error("Auth0 issuer or audience not configured");
    }

    const decoded = await new Promise<Record<string, unknown>>(
      (resolve, reject) => {
        jwt.verify(
          token,
          async (header, cb) => {
            try {
              const key = await this.getKey(header as JwtHeader);
              cb(null, key);
            } catch (error) {
              cb(error as Error);
            }
          },
          {
            issuer,
            audience,
            algorithms: ["RS256"],
          },
          (err, payload) => {
            if (err || !payload) {
              reject(err || new Error("Invalid token"));
              return;
            }
            resolve(payload as Record<string, unknown>);
          }
        );
      }
    );

    const rawRegions = decoded[regionClaim];
    const regions = Array.isArray(rawRegions)
      ? rawRegions.map((value) => String(value))
      : rawRegions
      ? [String(rawRegions)]
      : [];

    return {
      sub: String(decoded.sub ?? ""),
      email: decoded.email ? String(decoded.email) : undefined,
      roles: Array.isArray(decoded[rolesClaim])
        ? (decoded[rolesClaim] as string[])
        : [],
      regions,
    };
  }
}
