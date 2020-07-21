import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

// import User from '@modules/users/infra/typeorm/entities/user';
import AppError from '@shared/errors/AppError';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

interface IRequest {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUsersRepository,
    @inject('MailProvider')
    private mailProvider: IMailProvider,
    @inject('UserTokensRepository')
    private userTokenRepository: IUserTokensRepository,
  ) {}

  public async execute({ email }: IRequest): Promise<void> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError('User does not exist.', 400);
    }

    await this.userTokenRepository.generate(user.id);

    this.mailProvider.sendMail(
      email,
      'E-mail de recuperação de senha recebido.',
    );
  }
}

export default SendForgotPasswordEmailService;
