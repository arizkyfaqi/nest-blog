import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../post.entity';
import { Repository } from 'typeorm';
import { TagsService } from 'src/tags/providers/tags.service';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { Tag } from 'src/tags/tag.entity';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { User } from 'src/users/user.entity';

@Injectable()
export class CreatePostProvider {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    private readonly tagsService: TagsService,
    private readonly userService: UsersService,
  ) {}
  public async create(createPostDto: CreatePostDto, user: ActiveUserData) {
    let author: User | null = null;
    let tags: Tag[] = [];

    try {
      // Find Author from DB based on authorId
      author = await this.userService.findOneById(user.sub);
      //find tags
      tags = await this.tagsService.findMultipleTags(createPostDto.tags!);
    } catch (error) {
      throw new ConflictException(error);
    }

    if (createPostDto.tags?.length !== tags.length) {
      throw new BadRequestException('Please check your tag Ids');
    }

    // Create the post
    let post = this.postsRepository.create({
      ...createPostDto,
      author,
      tags,
    });

    try {
      //return the post
      return await this.postsRepository.save(post);
    } catch (error) {
      throw new ConflictException(error, {
        description: 'Ensure post slug is unique and not a duplicate',
      });
    }
  }
}
