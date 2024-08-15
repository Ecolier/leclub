import { Context } from "../context.model";

export const getAccessToken = (context: Context) => {
  const authorizationHeader = context.headers.authorization;
  if (!authorizationHeader) {
    context.status = 403;
    context.body = 'missing_authorization';
    return;
  }
  context.accessToken = authorizationHeader.split('Bearer ')[1];
}