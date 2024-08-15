import {Provider} from 'oidc-provider';
import {NextFunction, Request, Response} from 'express';
import { Context, Next } from 'koa';
import { AccountModel } from '../account/account.model';

const loginController = (provider: Provider, AccountModel: AccountModel) =>
  async (ctx: Context, next: Next) => {
    const details = await provider.interactionDetails(ctx.req, ctx.res);
    const account = await AccountModel.findOne({emailAddress: ctx.request.body.login});
    const result = {
      login: {
        accountId: account?.id,
      },
    };
    await provider.interactionFinished(ctx.req, ctx.res, result, {
      mergeWithLastSubmission: false,
    });
  };

export default loginController;