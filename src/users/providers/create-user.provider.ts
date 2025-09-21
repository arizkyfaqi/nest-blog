import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { MailService } from 'src/mail/providers/mail.service';

@Injectable()
export class CreateUserProvider {
  constructor(
    /**
     * Inject User Repository
     */
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    /**
     * Inject Hashing Provider
     */
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,

    /**
     *  Inject mailService
     */
    private readonly mailService: MailService,
  ) {}
  public async createUser(createUserDto: CreateUserDto) {
    let existUser: User | null;

    try {
      // Check is User exist with same email
      existUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try again later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    //hanlde execption
    if (existUser) {
      throw new BadRequestException(
        'The user already exist, please check your email.',
      );
    }

    //create a new user
    let newUser = this.userRepository.create({
      ...createUserDto,
      password: await this.hashingProvider.hashPassword(createUserDto.password),
    });

    try {
      newUser = await this.userRepository.save(newUser);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try again later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    try {
      await this.mailService.sendUserWelcome(newUser);
    } catch (error) {
      throw new RequestTimeoutException();
    }

    return newUser;
  }
}
