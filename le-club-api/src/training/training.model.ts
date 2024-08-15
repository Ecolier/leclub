import { ObjectId, Schema } from "mongoose";
import { Event, EventModel } from "../event/event.model";

export interface Training extends Event {
  initiator: ObjectId;
  description: string;
  team: ObjectId;
  recurring: boolean;
};

export const trainingModel = EventModel.discriminator('Training', new Schema({
  initiator: { 
    type: Schema.Types.ObjectId,
    required: true
  },
  description: String,
  team: {
    type: Schema.Types.ObjectId,
    required: true
  },
  recurring: {
    type: Boolean,
    required: true
  },
}));