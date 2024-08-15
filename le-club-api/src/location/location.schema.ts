import { gql } from "apollo-server-core";

export const locationSchema = gql`

  type Point {
    lat: Float!
    lng: Float!
  }

  type Location {
    name: String!
    coordinates: Point!
  }

  input PointInput {
    lat: Float!
    lng: Float!
  }

  input LocationInput {
    name: String!
    coordinates: PointInput!
  }

`;
