import { gql } from "apollo-server-core";

export const tournamentSchema = gql`

type Mutation {
  createTournament(tournament: TournamentInput!): Tournament!
}

type Query {
  findTournament(id: String!): Tournament
}

input TournamentInput {
  name: String!
  location: LocationInput!
  detection: Boolean!
  startAt: Date!
  endAt: Date!
  policy: String
  teams: [String]
  opposingTeams: [String]
}

type Tournament {
  name: String!
  location: Location!
  detection: Boolean!
  startAt: Date!
  endAt: Date!
  policy: String
  teams: [String]
  opposingTeams: [String]
}

`;