import { uuid } from 'uuidv4';

import User from '@modules/users/infra/typeorm/entities/user';
import IUserRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

class FakeUsersRepository implements IUserRepository {
  private users: User[] = [];

  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.email === email);
    return findUser;
  }

  public async findById(id: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.id === id);
    return findUser;
  }

  public async create({
    name,
    email,
    password,
  }: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, {
      id: uuid(),
      name,
      email,
      password,
    });

    this.users.push(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    const userIndex = this.users.findIndex(findUser => findUser.id === user.id);

    // Object.assign(user, { updated_at: new Date() });
    this.users[userIndex] = user;

    return user;
  }
}

export default FakeUsersRepository;
