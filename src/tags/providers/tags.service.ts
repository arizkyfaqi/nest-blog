import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Tag } from '../tag.entity';
import { CreateTagDto } from '../dto/create-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    /**
     * Inject tagsRepository
     */
    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>,
  ) {}

  public async create(createTagDto: CreateTagDto) {
    let tag = this.tagsRepository.create(createTagDto);

    return await this.tagsRepository.save(tag);
  }

  /**
   *
   * @param tags number
   * @returns result
   */
  public async findMultipleTags(tags: number[]) {
    let result = await this.tagsRepository.find({
      where: {
        id: In(tags),
      },
    });

    return result;
  }

  public async delete(id: number) {
    await this.tagsRepository.delete(id);

    return {
      delete: true,
      id,
    };
  }

  public async softRemove(id: number) {
    await this.tagsRepository.softDelete(id);

    return {
      delete: true,
      id,
    };
  }
}
