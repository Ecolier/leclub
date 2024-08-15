import { Logger } from "winston";
import { getEnvironment } from "@leclub/shared";
import createTournament from "./create-tournament";
import { TournamentInput } from "./tournament-input.model"

export interface CreateTournamentProps {
  logger?: Logger;
}

const createTournamentResolver = ({ logger }: CreateTournamentProps) =>
  async (parent: any, props: { tournament: TournamentInput }) => {
  const { tournament } = props;
  return createTournament({
    tournamentInput: tournament, 
    notificationServiceBaseUrl: getEnvironment('LCB_NOTIFICATION_SERVICE_BASE_URL')
  });
}

export default createTournamentResolver;