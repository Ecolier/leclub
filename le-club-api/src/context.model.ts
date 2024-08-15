import koa from 'koa';

export type Context = koa.ParameterizedContext<
  koa.DefaultState,
  koa.DefaultContext & {
    accessToken?: string;
  }
>;