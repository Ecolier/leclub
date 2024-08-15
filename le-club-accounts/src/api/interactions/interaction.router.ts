import bodyParser from 'koa-body';
import Router from 'koa-router';
import { NextServer } from 'next/dist/server/next';
import {Provider} from 'oidc-provider';
import { AccountModel } from '../account/account.model';
import {abortController} from './abort.controller';
import {confirmController} from './confirm.controller';
import {interactionController} from './interaction.controller';
import loginController from './login.controller';

const body = bodyParser({
  text: false, json: false, patchNode: true, patchKoa: true,
});

export const interactionRouter = (app: NextServer, provider: Provider, AccountModel: AccountModel) => {
  
  const router = new Router();

  router.use(async (ctx, next) => {
    ctx.set('Pragma', 'no-cache');
    ctx.set('Cache-Control', 'no-cache, no-store');
    try {
      await next();
    } catch (err) { }
  });

  router.get(
    '/login/:uid',
    body,
    interactionController(provider, app)
  );

  router.post(
    '/login/:uid',
    body,
    loginController(provider, AccountModel)
  );

  router.post(
    '/oidc/interaction/:uid/confirm',
    body,
    confirmController(provider)
  );

  router.get(
    '/interaction/:uid/abort',
    abortController(provider)
  );

  return router;
};
