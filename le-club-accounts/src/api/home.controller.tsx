import { ServerLocation } from "@reach/router";
import { Context } from "koa";
import { ClientMetadata, Provider } from "oidc-provider";
import { renderToString } from "react-dom/server";
import Index from "../pages/index";
import { Issuer, Client, generators } from "openid-client";

const homeController = (identityProvider: Provider, accountsClient: ClientMetadata) => 
  async (ctx: Context) => {
    const session = await identityProvider.Session.get(ctx)
    if(!session.accountId) {
      const issuer = await Issuer.discover(`${identityProvider.issuer}`);
      const client = new issuer.Client({
        client_id: accountsClient.client_id,
        client_secret: accountsClient.client_secret,
        redirect_uris: accountsClient.redirect_uris,
        response_types: accountsClient.response_types
      });
      const code_verifier = generators.codeVerifier();
      const code_challenge = generators.codeChallenge(code_verifier);
      const url = client.authorizationUrl({
        scope: 'openid email profile',
        code_challenge,
        code_challenge_method: 'S256',
      });
      return ctx.redirect(url);
    }
    const markup = renderToString(
      <ServerLocation url={ctx.url}>
        <Index />
      </ServerLocation>
    );
    ctx.body = markup;
  };

export default homeController;