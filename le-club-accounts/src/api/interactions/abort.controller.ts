import { Context, Next } from 'koa';
import {Provider} from 'oidc-provider';

export const abortController = (provider: Provider) =>
  async (ctx: Context, next: Next) => {
    const result = {
      error: 'access_denied',
      error_description: 'End-User aborted interaction',
    };
    await provider.interactionFinished(ctx.req, ctx.res, result, {
      mergeWithLastSubmission: false,
    });
  };
