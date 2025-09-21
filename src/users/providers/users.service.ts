import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/providers/auth.service';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import { DataSource, Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ConfigService, ConfigType } from '@nestjs/config';
import profileConfig from '../config/profile.config';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { CreateManyUserDto } from '../dtos/create-many-user.dto';
import { CreateUserProvider } from './create-user.provider';
import { FindOneUserByEmailProvider } from './find-one-user-by-email.provider';
import { FindOneByGoogleIdProvider } from './find-one-by-google-id.provider';
import { CreateGoogleUserProvider } from './create-google-user.provider';
import { GoogleUser } from '../interfaces/google-user.interfaces';

@Injectable()
/**
 * User class for managing user service
 */
export class UsersService {
  constructor(
    //Inject User Repository
    @InjectRepository(User)
    private userRepository: Repository<User>,

    /**
     * Inject users create many provider
     */
    private readonly userCreateManyProvider: UsersCreateManyProvider,

    /**
     * Inject Create User Provider
     */
    private readonly createUserProvider: CreateUserProvider,

    /**
     * Inject findOneByEmail
     */
    private readonly findOneByEmailProvider: FindOneUserByEmailProvider,

    /**
     * Inject findOneByGoogleId
     */
    private readonly findOneByGoogleIdProvider: FindOneByGoogleIdProvider,

    /**
     * Inject createGoogleUserProvider
     */
    private readonly createGoogleUserProvoder: CreateGoogleUserProvider,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    return this.createUserProvider.createUser(createUserDto);
  }

  /*
   * Method to find all the users
   */
  public findAll(
    getUserParamDto: GetUsersParamDto,
    limt: number,
    page: number,
  ) {
    return [
      {
        firstName: 'John',
        email: 'john@doe.com',
      },
      {
        firstName: 'Alice',
        email: 'alice@doe.com',
      },
    ];
  }

  /*
   * Find a user by ID
   */
  public async findOneById(id: number) {
    let user: User | null;

    try {
      user = await this.userRepository.findOneBy({ id });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try again later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    if (!user) {
      throw new NotFoundException(
        `The user with this ${id} not does not exist`,
      );
    }

    return user;
  }

  public async createMany(createManyUserDto: CreateManyUserDto) {
    return await this.userCreateManyProvider.createMany(createManyUserDto);
  }

  public async findOneByEmail(email: string) {
    return await this.findOneByEmailProvider.findOneByEmail(email);
  }

  public async findOneByGoogleId(googleId: string) {
    return await this.findOneByGoogleIdProvider.findOneByGoogleId(googleId);
  }

  public async createGoogleUser(googleUser: GoogleUser) {
    return await this.createGoogleUserProvoder.createGoogleUser(googleUser);
  }
}
