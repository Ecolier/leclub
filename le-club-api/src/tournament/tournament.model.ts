import { ObjectId, Schema } from "mongoose";
import { Event, EventModel } from "../event/event.model";

const TournamentPolicies = ['SingleElimination', 'Pool'] as const;
type TournamentPolicy = typeof TournamentPolicies[number];

export function isTournamentPolicy(tournamentPolicy: string): tournamentPolicy is TournamentPolicy {
  return TournamentPolicies.find(availableTournamentPolicy => tournamentPolicy === availableTournamentPolicy) ? true: false;
}

export interface Tournament extends Event {
  policy: TournamentPolicy;
  teams: ObjectId[];
  opposingTeams: ObjectId[];
  presentPlayers?: ObjectId[];
  absentPlayers?: ObjectId[];
};

export const TournamentModel = EventModel.discriminator('Tournament', new Schema({
  policy: {
    type: String,
    required: true,
    enum: ['SingleElimination', 'Pool']
  },
  teams: { 
    type: [Schema.Types.ObjectId],
    required: true
  },
  opposingTeams: { 
    type: [Schema.Types.ObjectId],
    required: true
  },
  presentPlayers: [Schema.Types.ObjectId],
  absentPlayers: [Schema.Types.ObjectId]
}));