import { EventModel, Event } from "../event/event.model";
import { TournamentInput } from "./tournament-input.model";
import { Tournament, TournamentModel } from "./tournament.model";
import http from 'http';
import mongoose from "mongoose";

export interface CreateTournamentProps {
  tournamentInput: TournamentInput;
  notificationServiceBaseUrl: string;
}

function createTournamentNotification(notificationServiceBaseUrl: string, tournament: any) {
  const data = JSON.stringify(tournament);
  const request = http.request(`${notificationServiceBaseUrl}/tournament/request`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  });
  request.write(data);
  request.end();
}

async function createTournament(props: CreateTournamentProps) {

  const { tournamentInput, notificationServiceBaseUrl } = props;

  const tournament = await new TournamentModel({
    ...tournamentInput,
    type: 'Tournament',
    location: {
      name: tournamentInput.location.name,
      type: 'Point',
      coordinates: [
        tournamentInput.location.coordinates.lng,
        tournamentInput.location.coordinates.lat
      ],
    }
  }).save();

  createTournamentNotification(notificationServiceBaseUrl, tournament);

  return tournament;
}

export default createTournament;