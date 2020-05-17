import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '../config/auth';
import AppError from '../errors/AppError';

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
    throw new AppError('JWT token is missing.', 401);
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
    throw new AppError('Invalid JWT token.', 401);
  }
}
