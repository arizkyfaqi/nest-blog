import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { SignInDto } from '../dto/signin.dto';
import { SignInProvider } from './sign-in.provider';
import { RefreshTokenDto } from '../dto/refresh-tokem.dto';
import { RefreshTokensProvider } from './refresh-tokens.provider';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    /**
     * Inject SigIn Provider
     */
    private readonly sigInProvider: SignInProvider,

    private readonly refreshTokenProvider: RefreshTokensProvider,
  ) {}

  public signIn(signInDto: SignInDto) {
    return this.sigInProvider.signIn(signInDto);
  }

  public refreshTokens(refreshTokens: RefreshTokenDto) {
    return this.refreshTokenProvider.refreshTokens(refreshTokens);
  }
}
