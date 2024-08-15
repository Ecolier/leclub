import { Logger } from "winston";
import findEvent from "../event/find-event";

export interface FindTournamentProps {
  logger?: Logger;
}

const findTournamentResolver = ({ logger }: FindTournamentProps) =>
  async (parent: any, props: { id: string }) => {
  return findEvent(props.id);
}

export default findTournamentResolver;