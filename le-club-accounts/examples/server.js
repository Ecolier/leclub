const { Issuer, generators } = require('openid-client');
const express = require('express');
const { getEnvironment } = require('@leclub/shared');
const debug = require('debug')('le-club:accounts:example');

const LCB_ACCOUNTS_EXAMPLE_HOST = getEnvironment('LCB_ACCOUNTS_EXAMPLE_HOST', '0.0.0.0');
const LCB_ACCOUNTS_EXAMPLE_PORT = getEnvironment('LCB_ACCOUNTS_EXAMPLE_PORT', '8200');
const LCB_ACCOUNTS_SERVICE_BASE_URL = getEnvironment('LCB_ACCOUNTS_SERVICE_BASE_URL');

const exampleApplication = express();

exampleApplication.get('/', (req, res) => {
  Issuer.discover(LCB_ACCOUNTS_SERVICE_BASE_URL)
  .then(function (leClubIssuer) {
    const client = new leClubIssuer.Client({
      client_id: '35290DBB934087CB9951',
      client_secret: '7fec27fbb41d8dba9a820522c25fe812ef71b7e53838d722b18e579cd0ac5bfc382a70a4fe44183b',
      redirect_uris: ['http://localhost:8200/cb'],
      response_types: ['code'],
    });
    const code_verifier = generators.codeVerifier();
    const code_challenge = generators.codeChallenge(code_verifier);
    const url = client.authorizationUrl({
      scope: 'openid email profile',
      code_challenge,
      code_challenge_method: 'S256',
    });
    res.redirect(url);
  });
});

exampleApplication.listen(LCB_ACCOUNTS_EXAMPLE_PORT, LCB_ACCOUNTS_EXAMPLE_HOST, () => {
  debug(`Listening on ${LCB_ACCOUNTS_EXAMPLE_HOST}:${LCB_ACCOUNTS_EXAMPLE_PORT}`);
});