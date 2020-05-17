import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import uploadConfig from '../config/upload';

import AppError from '../errors/AppError';

import User from '../models/User';

interface Request {
  user_id: string;
  avatarFileName: string;
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatarFileName }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne(user_id);

    if (!user) {
      throw new AppError('User not found.', 401);
    }

    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);

      // Delete previous avatar file, if exists
      // Changed because GoStack's implementation is not recommended
      try {
        fs.promises.unlink(userAvatarFilePath);
      } catch {
        // Error on file deletion. Not exists or without permissions.
        // This error shouldn't be sent to the user.
      }
    }

    user.avatar = avatarFileName;

    await usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
