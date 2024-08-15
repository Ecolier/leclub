import {ClientMetadata} from 'oidc-provider';

const leClubExampleClient: ClientMetadata = {
  client_id: '35290DBB934087CB9951',
  client_secret: '7fec27fbb41d8dba9a820522c25fe812ef71b7e53838d722b18e579cd0ac5bfc382a70a4fe44183b',
  client_name: 'football.leclub.example',
  application_type: 'web',
  redirect_uris: ['http://localhost:8200/cb'],
  response_types: ['code'],
  grant_types: ['authorization_code'],
  scope: 'openid profile email phone',
};

export default leClubExampleClient;
