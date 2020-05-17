import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import authConfig from '../config/auth';

import AppError from '../errors/AppError';

import User from '../models/User';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class AuthenticateUserService {
  private invalidAuthMessage = 'Incorrect e-mail/password combination.';

  public async execute({ email, password }: Request): Promise<Response> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new AppError(this.invalidAuthMessage, 401);
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError(this.invalidAuthMessage, 401);
    }

    const payload = {};

    const { privateKey, expiresIn } = authConfig.jwt;

    const token = sign(payload, privateKey, {
      subject: user.id,
      expiresIn,
    });

    return { user, token };
  }
}

export default AuthenticateUserService;
