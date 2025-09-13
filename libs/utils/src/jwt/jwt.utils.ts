import * as jwt from 'jsonwebtoken';

export interface JWTPayload {
  id: string;
}

export class JWTUtils {
  private static readonly secret = process.env.JWT_SECRET || 'default-secret';
  private static readonly refreshSecret =
    process.env.JWT_REFRESH_SECRET || 'default-refresh-secret';
  private static readonly expiresIn = process.env.JWT_EXPIRES_IN || '1h';
  private static readonly refreshExpiresIn =
    process.env.JWT_REFRESH_EXPIRES_IN || '7d';

  static generateAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn,
    });
  }

  static generateRefreshToken(
    payload: Omit<JWTPayload, 'iat' | 'exp'>,
  ): string {
    return jwt.sign(payload, this.refreshSecret, {
      expiresIn: this.refreshExpiresIn,
    });
  }

  static verifyAccessToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, this.secret) as JWTPayload;
    } catch {
      throw new Error('Invalid access token');
    }
  }

  static verifyRefreshToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, this.refreshSecret) as JWTPayload;
    } catch {
      throw new Error('Invalid refresh token');
    }
  }

  static decodeToken(token: string): JWTPayload | null {
    try {
      return jwt.decode(token) as JWTPayload;
    } catch {
      return null;
    }
  }
}
