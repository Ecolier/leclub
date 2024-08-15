import {ClientMetadata} from 'oidc-provider';

const leClubCoachProdClient: ClientMetadata = {
  client_id: '6F9E6F4BE096068F94CC',
  client_secret:
    '2736d849615108ce47c6aea581dc268eb904ee21c4f647148e83f583cb33aeada8efa5886d8ed0fe',
  client_name: 'football.leclub.coach.prod',
  application_type: 'web',
  redirect_uris: ['https://coach.lefoot.club'],
  client_uri: 'https://lefoot.club',
  response_types: ['code'],
  grant_types: ['authorization_code'],
  scope: 'openid profile email phone',
};

export default leClubCoachProdClient;
