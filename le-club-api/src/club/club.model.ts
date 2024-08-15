import { Schema, model, ObjectId } from 'mongoose';
import * as mongoose from 'mongoose';

export interface Club {
  name: string;
  region: string;
  department: string;
  teams: ObjectId[];
  coaches: ObjectId[];
  logoUrl: string;
  coverUrl: string;
}

const clubSchema = new Schema<Club>({
  name: { required: true, type: String },
  region: { required: true, type: String },
  department: { required: true, type: String },
  teams: [mongoose.Types.ObjectId],
  coaches: [mongoose.Types.ObjectId],
  logoUrl: String,
  coverUrl: String,
});

clubSchema.set('timestamps', true);

export const clubModel = model<Club>('Club', clubSchema);