import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import AppError from '@shared/errors/AppError';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordEmailService: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );
  });

  it('should be able to recover password with e-mail.', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUsersRepository.create({
      name: 'Luma Pontes',
      email: 'lumapontes@outlook.com',
      password: '123456',
    });

    await sendForgotPasswordEmailService.execute({
      email: 'lumapontes@outlook.com',
    });

    expect(sendMail).toBeCalled();
  });

  it('should not be able to recover a non existent user password', async () => {
    await expect(
      sendForgotPasswordEmailService.execute({
        email: 'lumapontes@outlook.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to generate forgot password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUsersRepository.create({
      name: 'Luma Pontes',
      email: 'lumapontes@outlook.com',
      password: '123456',
    });

    await sendForgotPasswordEmailService.execute({
      email: 'lumapontes@outlook.com',
    });

    expect(generateToken).toBeCalledWith(user.id);
  });
});
