import { Repository, getRepository } from 'typeorm';
// import { hash } from 'bcryptjs';

import User from '@modules/users/infra/typeorm/entities/user';
import IUserRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
// import AppError from '@shared/errors/AppError';

class UsersRepository implements IUserRepository {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = getRepository(User);
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    return user;
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne(id);

    return user;
  }

  public async create({
    name,
    email,
    password,
  }: ICreateUserDTO): Promise<User> {
    const user = this.userRepository.create({
      name,
      email,
      password,
    });

    await this.userRepository.save(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    const updatedUser = await this.userRepository.save(user);
    return updatedUser;
  }
}

export default UsersRepository;
