import { LocationInput } from "../location/location-input";
import { Location } from "../location/location.model";

export interface EventInput {
  name: string;
  type: string;
  location: LocationInput;
  detection: boolean;
  startAt: Date;
  endAt: Date;
};