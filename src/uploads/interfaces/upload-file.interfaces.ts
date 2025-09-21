import { fileType } from '../enums/file-type.enum';

export interface UploadFile {
  name: string;
  path: string;
  type: fileType;
  mime: string;
  size: number;
}
