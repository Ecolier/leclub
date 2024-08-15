import { Schema, model } from 'mongoose';
import { Location, locationSchema } from '../location/location.model';
 
const EventTypes = ['Tournament', 'Training', 'Friendly'] as const;
type EventType = typeof EventTypes[number];


export function isEventType(eventType: string): eventType is EventType {
  return EventTypes.find(availableEventType => eventType === availableEventType) ? true: false;
}

export interface Event {
  name: string;
  type: EventType;
  location: Location;
  detection: boolean;
  startAt: Date;
  endAt: Date;
};

const eventSchema = new Schema<Event>({
  name: { 
    required: true, 
    type: String
  },
  type: { 
    required: true,
    type: String,
    enum: ['Tournament', 'Training', 'Friendly']
  },
  detection: { 
    required: true,
    type: Boolean
  },
  startAt: {
    type: Date,
    required: true
  },
  endAt: {
    type: Date,
    required: true
  },
  location: locationSchema,
}, {
  discriminatorKey: 'type'
});

eventSchema.set('timestamps', true);

export const EventModel = model<Event>('Event', eventSchema);