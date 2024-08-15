import { gql } from "apollo-server-core";

export const videoSchema = gql`

scalar Upload

type Mutation {
  uploadVideo(upload: VideoUpload!): Video!
}

type Query {
  findVideo(id: String!): Video
}

input VideoUpload {
  file: Upload!
  tags: [String]
  players: [String]
  event: String
}

type Video {
  url: String!
  tags: [String]
  players: [String]
  event: String
}

`;