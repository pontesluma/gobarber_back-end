import AppError from '@shared/errors/AppError';

import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

describe('AuthenticateUser', () => {
  it('should not be able to authenticate user with wrong password', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    const authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await createUserService.execute({
      name: 'Luma Pontes',
      email: 'luma@gmail.com',
      password: '123456',
    });

    await expect(
      authenticateUserService.execute({
        email: 'luma@gmail.com',
        password: 'abcd',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to authenticate user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    const authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const user = await createUserService.execute({
      name: 'Luma Pontes',
      email: 'luma@gmail.com',
      password: '123456',
    });

    const response = await authenticateUserService.execute({
      email: 'luma@gmail.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate non existent user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await expect(
      authenticateUserService.execute({
        email: 'luma@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
