import { EventModel, Event } from "./event.model";

function createEvent(event: Event) {
  return new EventModel({
    ...event,
  }).save();
}

export default createEvent;