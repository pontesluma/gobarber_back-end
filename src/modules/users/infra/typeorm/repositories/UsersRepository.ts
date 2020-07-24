import { Repository, getRepository, Not } from 'typeorm';
// import { hash } from 'bcryptjs';

import User from '@modules/users/infra/typeorm/entities/user';
import IUserRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';
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

  public async findAllProviders({
    exept_user_id,
  }: IFindAllProvidersDTO): Promise<User[]> {
    let users: User[];

    if (exept_user_id) {
      users = await this.userRepository.find({
        where: {
          id: Not(exept_user_id),
        },
      });
    } else {
      users = await this.userRepository.find();
    }

    return users;
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
