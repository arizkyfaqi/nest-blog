import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserProvider } from './create-user.provider';
import { MailService } from 'src/mail/providers/mail.service';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { DataSource, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { BadRequestException } from '@nestjs/common';

type MockingRepository<T = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;
const createMockRepository = <T = any>(): MockingRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});
describe('CreateUserProvider', () => {
  let provider: CreateUserProvider;
  let userRepository: MockingRepository;
  const user = {
    firstName: 'Jhone',
    lastName: 'Cina',
    email: 'jhonecina@example.com',
    password: 'password',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserProvider,
        { provide: DataSource, useValue: {} },
        { provide: getRepositoryToken(User), useValue: createMockRepository() },
        {
          provide: MailService,
          useValue: { sendUserWelcome: jest.fn(() => Promise.resolve()) },
        },
        {
          provide: HashingProvider,
          useValue: { hashPassword: jest.fn(() => user.password) },
        },
      ],
    }).compile();

    provider = module.get<CreateUserProvider>(CreateUserProvider);
    userRepository = module.get(getRepositoryToken(User));
  });

  it('Should be defined', () => {
    expect(provider).toBeDefined;
  });

  describe('createUser', () => {
    describe('When the user does not exist in database', () => {
      it('should create a new user', async () => {
        userRepository.findOne.mockReturnValue(null);
        userRepository.create.mockReturnValue(user);
        userRepository.save.mockReturnValue(user);
        const newUser = await provider.createUser(user);
        expect(userRepository.findOne).toHaveBeenCalledWith({
          where: { email: user.email },
        });
        expect(userRepository.create).toHaveBeenCalledWith(user);
        expect(userRepository.save).toHaveBeenCalledWith(user);
      });
    });

    describe('When user exist', () => {
      it('throw BadRequestException', async () => {
        userRepository.findOne.mockReturnValue(user.email);
        userRepository.create.mockReturnValue(user);
        userRepository.save.mockReturnValue(user);
        try {
          const newUser = await provider.createUser(user);
        } catch (error) {
          expect(error).toBeInstanceOf(BadRequestException);
        }
      });
    });
  });
});
