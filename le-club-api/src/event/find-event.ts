import { EventModel } from "./event.model";

async function findEvent(id: string) {
  return EventModel.findById(id);
}

export default findEvent;