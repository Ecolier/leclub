import {ClientMetadata} from 'oidc-provider';

const leClubCoachDevClient: ClientMetadata = {
  client_id: '9DE5DFA12BBA4C811322',
  client_secret:
    'b45ebf71b41ca620a4cd3176fac3eb6449223d0fde78156928164872a4687efb465c86af12409bd2',
  client_name: 'football.leclub.coach.dev',
  application_type: 'web',
  redirect_uris: ['http://localhost:8081/cb'],
  client_uri: 'https://lefoot.club',
  response_types: ['code'],
  grant_types: ['authorization_code'],
  scope: 'openid profile email phone',
};

export default leClubCoachDevClient;
