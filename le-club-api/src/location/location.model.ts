import { Schema } from "mongoose";

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Location {
  name: string;
  type: string;
  coordinates: number[];
};

export const locationSchema = new Schema<Location>({
  name: { 
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  }
});