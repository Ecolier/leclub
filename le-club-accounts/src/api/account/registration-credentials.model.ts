export type Role = 'coach' | 'supporter' | 'player';

export interface BaseRegistrationCredentials {
  emailAddress?: string;
  phoneNumber?: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  profilePicture?: string;
}

export interface CoachRegistrationCredentials
  extends BaseRegistrationCredentials {
  nickname: string;
  club: string;
  teams: string[];
}

export interface PlayerRegistrationCredentials
  extends BaseRegistrationCredentials {
  nickname: string;
  club: string;
  team: string;
}

export type SupporterRegistrationCredentials = BaseRegistrationCredentials;

export type RegistrationCredentials =
  | CoachRegistrationCredentials
  | PlayerRegistrationCredentials
  | SupporterRegistrationCredentials;
