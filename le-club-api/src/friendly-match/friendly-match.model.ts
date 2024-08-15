import { ObjectId, Schema } from "mongoose";
import { Event, EventModel } from "../event/event.model";

export interface FriendlyMatch extends Event {
  team: ObjectId;
  opposingTeam: ObjectId;
  starterPlayers: ObjectId[];
  substitutePlayers: ObjectId[];
}

export const FriendlyMatchModel = EventModel.discriminator('FriendlyMatch', new Schema({
  team: { 
    type: Schema.Types.ObjectId,
    required: true
  },
  opposingTeam: {
    type: Schema.Types.ObjectId,
    required: true
  },
  starterPlayers: {
    type: [Schema.Types.ObjectId],
    required: true
  },
  substitutePlayers: {
    type: [Schema.Types.ObjectId],
    required: true
  },
}));