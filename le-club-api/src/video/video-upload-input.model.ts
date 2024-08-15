import { FileUpload } from 'graphql-upload';

export interface VideoUploadInput {
  file: Promise<FileUpload>;
  tags: string[];
  players: string[];
  event: string;
}