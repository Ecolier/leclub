import {Provider} from 'oidc-provider';
import { NextServer } from 'next/dist/server/next';
import { Context, Next } from 'koa';

export const interactionController = (provider: Provider, app: NextServer) =>
  async (ctx: Context, next: Next) => {

    const { request, response, req, res } = ctx;

    const {uid, prompt, params, session} = await provider.interactionDetails(
      req, res
    );

    const client = await provider.Client.find(params.client_id as string);

    switch (prompt.name) {
      case 'login': {
        return app.render(req, res, '/login');
      }
      case 'consent': {
        return app.render(req, res, '/consent');
      }
      default:
        return undefined;
    }
    
  };
