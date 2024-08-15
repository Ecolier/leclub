import {ClientMetadata} from 'oidc-provider';

function leClubAccountsClient (environment: 'production' | 'development'): ClientMetadata {
  if (environment === 'development') {
    return {
      client_id: '35290DBB644087CB5551',
      client_secret: '7fec27fbb41d8dba9a820536c25fe812ef71b7e56038d722b18e579cd0ac5bfc382a70a4fe44183b',
      client_name: 'football.leclub.accounts',
      application_type: 'web',
      redirect_uris: ['http://localhost:8081'],
      response_types: ['code'],
      grant_types: ['authorization_code'],
      scope: 'openid profile email phone',
    };
  }
  else {
    return {
      client_id: '35290DBB644087CB5551',
      client_secret: '7fec27fbb41d8dba9a820536c25fe812ef71b7e56038d722b18e579cd0ac5bfc382a70a4fe44183b',
      client_name: 'football.leclub.example',
      application_type: 'web',
      redirect_uris: ['http://accounts.leclub.football'],
      response_types: ['code'],
      grant_types: ['authorization_code'],
      scope: 'openid profile email phone',
    };
  }
}

export default leClubAccountsClient;
