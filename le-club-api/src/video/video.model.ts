import { Blob } from 'buffer';
import { Schema, model, Types, ObjectId } from 'mongoose';
import { Readable } from 'stream';

export interface Video {
  url: string;
  tags?: string[];
  players?: ObjectId[];
  event?: ObjectId;
}

export interface VideoUpload {
  players?: string[];
  tags?: string[]
  event?: string;
  type: string;
  encoding: string;
  payload: Buffer | Blob | Readable;
}

const videoSchema = new Schema<Video>({
  url: {
    required: true,
    type: String,
  },
  tags: [String],
  players: [Schema.Types.ObjectId],
  event: Schema.Types.ObjectId
});

videoSchema.set('timestamps', true);

export const VideoModel = model<Video>('Video', videoSchema);