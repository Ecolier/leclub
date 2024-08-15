import { Schema, model, ObjectId } from 'mongoose';

export interface Team {
  name: string;
  coach: ObjectId;
  club: ObjectId;
  players: ObjectId[];
}

const teamSchema = new Schema<Team>({
  name: { type: String, required: true },
  coach: { type: Schema.Types.ObjectId, required: true },
  club: { type: Schema.Types.ObjectId, required: true },
  players: [Schema.Types.ObjectId],
});

teamSchema.set('timestamps', true);

export const TeamModel = model<Team>('Team', teamSchema);