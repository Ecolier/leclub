import Koa, { Context } from 'koa';
import next from 'next';
import Router from 'koa-router';
import openIdConfig from './openid-config';
import config from './config';
import connect from './database';
import {
  passwordGrantHandler,
  passwordGrantParameters,
  passwordGrantType,
} from './grant-types/password.grant-type';
import createAccountController from './account/create-account.controller';
import {interactionRouter} from './interactions/interaction.router';
import { getEnvironment } from '@leclub/shared';
import accountModel from './account/account.model';
import mount from 'koa-mount';
import {Provider} from 'oidc-provider';
import koaBody from 'koa-body';
import homeController from './home.controller';

// Built-in clients

import leClubAppClient from './first-party/football.le-club.app';
import leClubCoachDevClient from './first-party/football.le-club.coach.development';
import leClubCoachProdClient from './first-party/football.le-club.coach.production';
import leClubExampleClient from './first-party/football.le-club.example';
import leClubAccountsClient from './first-party/football.leclub.accounts';
import serve from 'koa-static';
import errorController from './error.controller';
import { generators, Issuer } from 'openid-client';

export interface ApplicationOptions {
  environment: 'production' | 'development';
}

async function application (options: ApplicationOptions) {

  const server = new Koa();

  const router = new Router();
  const app = next({ dev: options.environment === 'development' });
  const handle = app.getRequestHandler();

  await app.prepare();

  router.all('/_next/(.*)', async (ctx: Context) => {
    return handle(ctx.req, ctx.res);
  });

  connect({
    scheme: getEnvironment('NODE_ENV') === 'development' ? 'mongodb' : 'mongodb+srv',
    endpoint: getEnvironment('LCB_ACCOUNTS_DATABASE_ENDPOINT'),
    databaseName: getEnvironment('LCB_ACCOUNTS_DATABASE_NAME'),
    username: getEnvironment('LCB_ACCOUNTS_DATABASE_USERNAME'),
    password: getEnvironment('LCB_ACCOUNTS_DATABASE_PASSWORD'),
  });
  
  const AccountModel = accountModel(
    config.account.validEmailAddressFormat,
    config.account.validPhoneNumberFormat
  );

  const accountsClient = leClubAccountsClient(options.environment);
  const identityProvider = new Provider(`http://localhost:8081/api`, openIdConfig(AccountModel, [
    leClubAppClient, leClubCoachDevClient, leClubCoachProdClient, leClubExampleClient, accountsClient
  ]));

  identityProvider.registerGrantType(
    passwordGrantType,
    passwordGrantHandler(AccountModel),
    passwordGrantParameters
  );

  router.get('/', homeController(identityProvider, accountsClient));

  router.post('/api/register', koaBody(), createAccountController(AccountModel, {
    validPasswordFormat: config.account.validPasswordFormat
  }));

  router.get('/api/hasura', async (ctx: Context) => {
    const { authorization } = ctx.headers;

    if (!authorization) {
      ctx.status = 403;
      return;
    }

    const token = authorization.split(' ')[1];

    const issuer = await Issuer.discover(`${identityProvider.issuer}/api`);
    const client = new issuer.Client({
      client_id: accountsClient.client_id,
      client_secret: accountsClient.client_secret,
      redirect_uris: accountsClient.redirect_uris,
      response_types: accountsClient.response_types
    });

    const { active, sub } = await client.introspect(token);

    if (!active) {
      ctx.status = 403;
      return;
    }

    const account = await AccountModel.findOne({ _id: sub });

    ctx.body = {
      'X-Hasura-Role': account.role,
      'X-Hasura-User-Id': account.id
    };

  });

  server.use(errorController);
  server.use(router.routes());
  server.use(interactionRouter(app, identityProvider, AccountModel).routes());
  server.use(mount('/api', identityProvider.app));

  return server;
};

export default application;
