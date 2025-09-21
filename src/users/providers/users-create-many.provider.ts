import {
  BadRequestException,
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../user.entity';
import { DataSource } from 'typeorm';
import { CreateManyUserDto } from '../dtos/create-many-user.dto';

@Injectable()
export class UsersCreateManyProvider {
  constructor(
    /**
     * Inject Datasource
     */
    private readonly datasource: DataSource,
  ) {}

  public async createMany(createManyUserDto: CreateManyUserDto) {
    let newUsers: User[] = [];
    // Create query runner instance
    const queryRunner = this.datasource.createQueryRunner();

    try {
      // Connect query runner to datasource
      await queryRunner.connect();
      // Start transaction
      await queryRunner.startTransaction();
    } catch (error) {
      throw new RequestTimeoutException('Could not connect to the database');
    }

    try {
      for (let user of createManyUserDto.users) {
        let newUser = queryRunner.manager.create(User, user);
        let result = await queryRunner.manager.save(newUser);
        newUsers.push(result);
      }
      // If success commit
      await queryRunner.commitTransaction();
    } catch (error) {
      // If Unsuccess rollback
      await queryRunner.rollbackTransaction();
      throw new ConflictException('Could not complate the transaction', {
        description: String(error),
      });
    } finally {
      try {
        // Release connection
        await queryRunner.release();
      } catch (error) {
        throw new RequestTimeoutException('Could not release the conecction', {
          description: String(error),
        });
      }
    }

    return newUsers;
  }
}
