import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '../config/auth';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  // Validate JWT token
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new Error('JWT token is missing.');
  }

  // `Bearer ${token}`
  const [, token] = authHeader.split(' ');

  try {
    const decodedToken = verify(token, authConfig.jwt.privateKey);
    const { sub } = decodedToken as TokenPayload;

    // Add user info in request to the next functions
    // type definition created in src/@types
    request.user = { id: sub };

    return next();
  } catch {
    throw new Error('Invalid JWT token.');
  }
}
