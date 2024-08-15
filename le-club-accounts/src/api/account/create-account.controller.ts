import { Context, Next } from 'koa';
import * as _ from 'lodash';
import { AccountModel } from './account.model';
import createAccount, { CreateAccountOptions } from './create-account';

const createAccountController = (AccountModel: AccountModel, options: CreateAccountOptions) =>
  async (ctx: Context, next: Next) => {
    const {credentials} = ctx.request.body;
    await createAccount(credentials, AccountModel, options);
    ctx.status = 200;
  };

export default createAccountController;