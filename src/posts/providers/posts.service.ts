import {
  BadRequestException,
  Body,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { Repository } from 'typeorm';
import { MetaOption } from 'src/meta-options/meta-options.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../post.entity';
import { TagsService } from 'src/tags/providers/tags.service';
import { Tag } from 'src/tags/tag.entity';
import { PatchPostDto } from '../dto/patch-post.dto';
import { GetPostsDto } from '../dto/get-post.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interfaces';
import { CreatePostProvider } from './create-post.provider';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,
    /**
     * Inject Tags Service
     */
    private readonly tagsService: TagsService,
    private readonly userService: UsersService,
    /**
     * Inject Pagination Provider
     */
    private readonly paginationProvider: PaginationProvider,
    /**
     * Inject postProvider
     */
    private readonly createPostProvider: CreatePostProvider,
  ) {}

  /**
   *
   * @param userId
   * @returns
   */
  public async findAll(
    postQuery: GetPostsDto,
    userId: string,
  ): Promise<Paginated<Post>> {
    let post = await this.paginationProvider.paginateQuery(
      {
        limit: postQuery.limit,
        page: postQuery.page,
      },
      this.postsRepository,
    );

    return post;
  }

  public async create(createPostDto: CreatePostDto, user: ActiveUserData) {
    // return the post
    return await this.createPostProvider.create(createPostDto, user);
  }

  public async delete(id: number) {
    //Deleting the post
    await this.postsRepository.delete(id);

    //confirm
    return { deleted: true, id };
  }

  public async update(patchPostDto: PatchPostDto) {
    let tags;
    let post;

    try {
      // Find the tags
      tags = patchPostDto.tags
        ? await this.tagsService.findMultipleTags(patchPostDto.tags)
        : [];
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
      );
    }

    /**
     * Number of tags need to be equal
     */
    if (!tags || tags.length != patchPostDto.tags?.length) {
      throw new BadRequestException(
        'Please Check your tag Ids and ensure they are correct',
      );
    }

    // Find the post
    try {
      post = await this.postsRepository.findOneBy({
        id: patchPostDto.id,
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
      );
    }

    if (!post) {
      throw new NotFoundException(`Post with ID ${patchPostDto.id} not found!`);
    }

    // Update the properties
    post.title = patchPostDto.title ?? post.title;
    post.content = patchPostDto.content ?? post.content;
    post.status = patchPostDto.status ?? post.status;
    post.postType = patchPostDto.postType ?? post.postType;
    post.slug = patchPostDto.slug ?? post.slug;
    post.featuredImageUrl =
      patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
    post.publishOn = patchPostDto.publishOn ?? post.publishOn;

    // Assign the new tags
    post.tags = tags;

    // Save the post and return
    try {
      await this.postsRepository.save(post);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
      );
    }
    return post;
  }
}
