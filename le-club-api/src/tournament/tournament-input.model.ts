import { EventInput } from "../event/event-input.model";

export interface TournamentInput extends EventInput {
  policy: string;
  teams: string[];
  opposingTeams: string[];
}