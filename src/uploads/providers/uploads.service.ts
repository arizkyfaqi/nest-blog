import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Upload } from '../upload.entity';
import { UploadToAwsProvider } from './upload-to-aws.provider';
import { UploadFile } from '../interfaces/upload-file.interfaces';
import { fileType } from '../enums/file-type.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadsService {
  constructor(
    /**
     * Inject uploadToAwsProvider
     */
    private readonly uploadToAwsProvider: UploadToAwsProvider,

    /**
     * Inject configService
     */
    private readonly configService: ConfigService,

    /**
     * Inject Upload Repository
     */
    @InjectRepository(Upload)
    private readonly uploadsRepository: Repository<Upload>,
  ) {}
  public async uploadFile(file: Express.Multer.File) {
    //throw error for unsupport MIME type
    if (
      !['image/gif', 'image/jpeg', 'image/jpg', 'image/png'].includes(
        file.mimetype,
      )
    ) {
      throw new BadRequestException('Mime type not supported!');
    }

    try {
      //Upload the file to aws s3
      const name = await this.uploadToAwsProvider.fileUpload(file);

      //Generate to a new entry in database
      const uploadFile: UploadFile = {
        name: name,
        path: `https://${this.configService.get('appConfig.awsCloudFrontUrl')}/${name}`,
        type: fileType.IMAGE,
        mime: file.mimetype,
        size: file.size,
      };

      const upload = this.uploadsRepository.create(uploadFile);
      return await this.uploadsRepository.save(upload);
    } catch (error) {
      throw new ConflictException(error);
    }
  }
}
