import { Repository, getRepository } from 'typeorm';

import UserToken from '@modules/users/infra/typeorm/entities/userToken';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';

class UserTokensRepository implements IUserTokensRepository {
  private userTokenRepository: Repository<UserToken>;

  constructor() {
    this.userTokenRepository = getRepository(UserToken);
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = await this.userTokenRepository.findOne({
      where: { token },
    });

    return userToken;
  }

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = this.userTokenRepository.create({
      user_id,
    });

    await this.userTokenRepository.save(userToken);

    return userToken;
  }
}

export default UserTokensRepository;
