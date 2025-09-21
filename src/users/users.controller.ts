import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Post,
  Query,
  Headers,
  Ip,
  ValidationPipe,
  DefaultValuePipe,
  ParseIntPipe,
  Patch,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './providers/users.service';
import { GetUsersParamDto } from './dtos/get-users-param.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { PatchUserDto } from './dtos/patch-user.dto';
import { CreateManyUserDto } from './dtos/create-many-user.dto';
import { AccessTokenGuard } from 'src/auth/guards/access-token/access-token.guard';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  // Injecting User Service
  constructor(private readonly usersService: UsersService) {}

  @Get('/:id')
  @ApiOperation({
    summary: 'Fetches a list of registered users on the application.',
  })
  @ApiQuery({
    name: 'limit',
    type: String,
    description: 'The upper limit of pages you want the pagination to return',
    required: false,
  })
  @ApiQuery({
    name: 'page',
    type: String,
    description:
      'The position of the page number that you want the API to return',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Users fetched successfully based on the query',
  })
  public getUsers(
    @Param() getUserParamDto: GetUsersParamDto,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.usersService.findAll(getUserParamDto, limit, page);
  }

  @Post()
  @Auth(AuthType.None)
  @UseInterceptors(ClassSerializerInterceptor)
  public createUsers(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Patch()
  public patchUser(@Body() patchUserDto: PatchUserDto) {
    return patchUserDto;
  }

  @Post('create-many')
  public createManyUsers(@Body() createManyUserDto: CreateManyUserDto) {
    return this.usersService.createMany(createManyUserDto);
  }
}
