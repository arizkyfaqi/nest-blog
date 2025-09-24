import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiHeaders, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Express } from 'express';
import { UploadsService } from './providers/uploads.service';

@ApiTags('Upload File')
@Controller('uploads')
export class UploadsController {
  constructor(
    /**
     * Inject uploadServices
     */

    private readonly uploadServices: UploadsService,
  ) {}
  @UseInterceptors(FileInterceptor('file'))
  @ApiHeaders([
    { name: 'Content-Type', description: 'multipart/form-data' },
    { name: 'Authorization', description: 'Bearer Token' },
  ])
  @ApiOperation({
    summary: 'Upload a new image to the server',
  })
  @Post('file')
  public uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadServices.uploadFile(file);
  }
}
