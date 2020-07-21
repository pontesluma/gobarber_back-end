import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
import UpdateUserAvatarService from './UpdateUserAvatarService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

describe('UpdateUserAvatar', () => {
  it('should be able to update user avatar', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();
    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const user = await fakeUsersRepository.create({
      name: 'Luma Pontes',
      email: 'luma@gmail.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'file.png',
    });

    expect(user.avatar).toBe('file.png');
  });

  it('should be able to delete old user avatar', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();
    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      name: 'Luma Pontes',
      email: 'luma@gmail.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'file.png',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'newfile.png',
    });

    expect(deleteFile).toHaveBeenCalledWith('file.png');
    expect(user.avatar).toBe('newfile.png');
  });

  it('should not be able to upload non existent user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    await expect(
      updateUserAvatar.execute({
        user_id: '123456',
        avatarFilename: 'file.png',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
