import {ClientMetadata} from 'oidc-provider';

const leClubAppClient: ClientMetadata = {
  client_id: 'E931DDB2B23A5714CCB6',
  client_secret:
    '1bce997194bf7a829bc6d1da554195c529b8f93f46a11832f274dd8eefe125cf250641632a7e67f6',
  client_name: 'com.leclub.app',
  application_type: 'native',
  redirect_uris: ['com.leclub.app://authorization'],
  client_uri: 'https://lefoot.club',
  response_types: ['code', 'id_token'],
  grant_types: ['password', 'implicit', 'authorization_code', 'refresh_token'],
  scope: 'openid profile email phone',
};

export default leClubAppClient;
