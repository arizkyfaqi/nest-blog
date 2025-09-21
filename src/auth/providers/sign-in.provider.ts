import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from '../dto/signin.dto';
import { UsersService } from 'src/users/providers/users.service';
import { HashingProvider } from './hashing.provider';
import { GenerateTokensProvider } from './generate-tokens.provider';

@Injectable()
export class SignInProvider {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    private readonly hashingProvider: HashingProvider,

    /**
     * Inject Generate Token Provider
     */
    private readonly generateTokenProvider: GenerateTokensProvider,
  ) {}
  public async signIn(signInDto: SignInDto) {
    // Find the user using email Id
    // Throw an exception user not found
    let user = await this.usersService.findOneByEmail(signInDto.email);

    // Compare password to the hash
    let isEqual: boolean = false;
    // If user has no password (Google login, etc.), block normal login
    // if (!user?.password) {
    //   throw new BadRequestException(
    //     'This account does not use password login, please login using Google Sign-In',
    //   );
    // }

    try {
      isEqual = await this.hashingProvider.comparePassword(
        signInDto.password,
        user.password,
      );
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Could not compare password',
      });
    }

    if (!isEqual) {
      throw new UnauthorizedException('Incorrect password');
    }

    return await this.generateTokenProvider.generateTokens(user);
  }
}
