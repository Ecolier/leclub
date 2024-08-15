import { Context, Next } from 'koa';
import {Provider} from 'oidc-provider';

export const confirmController = (provider: Provider) =>
  async (ctx: Context, next: Next) => {
    const interactionDetails = await provider.interactionDetails(ctx.req, ctx.res);
    const {
      prompt: {details},
      params,
      uid,
      session: {accountId},
    } = interactionDetails as any;

    let {grantId} = interactionDetails;
    let grant;

    if (grantId) {
      // we'll be modifying existing grant in existing session
      grant = await provider.Grant.find(grantId);
    } else {
      // we're establishing a new grant
      grant = new provider.Grant({
        accountId,
        clientId: params.client_id,
      });
    }

    if (details.missingOIDCScope) {
      grant!.addOIDCScope(details.missingOIDCScope.join(' '));
    }
    if (details.missingOIDCClaims) {
      grant!.addOIDCClaims(details.missingOIDCClaims);
    }
    if (details.missingResourceScopes) {
      // eslint-disable-next-line no-restricted-syntax
      for (const [indicator, scopes] of Object.entries(
        details.missingResourceScopes
      )) {
        grant!.addResourceScope(indicator, (scopes as string[]).join(' '));
      }
    }

    grantId = await grant!.save();

    const consent: any = {};
    if (!interactionDetails.grantId) {
      // we don't have to pass grantId to consent, we're just modifying existing one
      consent.grantId = grantId;
    }

    const result = {consent};

    await provider.interactionFinished(ctx.req, ctx.res, result, {
      mergeWithLastSubmission: false,
    });
  };
