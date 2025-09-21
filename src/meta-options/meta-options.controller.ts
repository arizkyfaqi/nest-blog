import { Body, Controller, Post } from '@nestjs/common';
import { CreatePostMetaOptionsDto } from './dto/create-post-meta-options.dto';
import { MetaOptionsService } from './providers/meta-options.service';

@Controller('meta-options')
export class MetaOptionsController {
  constructor(
    /**
     * Inject meta oprion services
     */

    private readonly metaOptionServices: MetaOptionsService,
  ) {}
  @Post()
  public create(@Body() createPostMetaOptionsDto: CreatePostMetaOptionsDto) {
    return this.metaOptionServices.create(createPostMetaOptionsDto);
  }
}
