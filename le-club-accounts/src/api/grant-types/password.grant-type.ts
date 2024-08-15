import {KoaContextWithOIDC, errors} from 'oidc-provider';
import {AccountModel} from '../account/account.model';
import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';

export const passwordGrantParameters = [
  'email_address',
  'phone_number',
  'password',
  'client_id',
  'client_secret',
  'grant_type',
  'scope',
];

export const passwordGrantType = 'password';

export const passwordGrantHandler = (AccountModel: AccountModel) =>
  async (ctx: KoaContextWithOIDC, next: () => Promise<void>) => {
  const {AccessToken, RefreshToken, IdToken, Grant} = ctx.oidc.provider;
  const {client} = ctx.oidc;
  const {email_address, phone_number, password, grant_type, scope} = ctx.oidc
    .params as {[key: string]: string};

  const clientScopes = client!.scope!.split(' ');
  const requestedScopes = scope.split(' ');

  if (!email_address && !phone_number) {
    throw 'Must authenticate with either email address or phone number.';
  }

  if (!password || !grant_type || !scope) {
    throw 'Invalid arguments';
  }

  if (_.difference(requestedScopes, clientScopes).length !== 0) {
    throw new Error('scope_mismatch');
  }

  try {

    const uniqueKey = email_address || phone_number;
    const user = email_address 
      ? await AccountModel.findOne({emailAddress: email_address})
      : await AccountModel.findOne({phoneNumber: phone_number});

    if (!user) {
      throw new errors.UnknownUserId();
    }

    const comparisonSuccess = await bcrypt.compare(password, user.password);

    if (!comparisonSuccess) {
      ctx.status = 403;
      throw new errors.InvalidRequest('bad_credentials', 403);
    }

    const gt = new Grant({
      clientId: client!.clientId,
      accountId: user._id.toString(),
    });

    gt.addOIDCScope(scope);

    const grant = await gt.save();

    const authTime = Date.now() / 1000;

    const at = new AccessToken({
      accountId: user._id.toString(),
      client: client!,
      grantId: grant,
      gty: 'password',
      scope: scope,
    });

    const accessToken = await at.save();

    const rt = new RefreshToken({
      accountId: user._id.toString(),
      authTime: authTime,
      client: client!,
      grantId: grant,
      gty: 'password',
      rotations: 0,
      scope: scope,
    });

    if (client!.tokenEndpointAuthMethod === 'none') {
      if (at.jkt) {
        rt.jkt = at.jkt;
      }

      if (client!.tlsClientCertificateBoundAccessTokens) {
        rt['x5t#S256'] = at['x5t#S256'];
      }
    }

    ctx.oidc.entity('RefreshToken', rt);
    const refreshToken = await rt.save();

    const account = await ctx.oidc.provider.Account.findAccount(
      ctx,
      user._id.toString()
    );

    if (!account) {
      throw 'no account';
    }

    const token = new IdToken(
      {
        auth_time: authTime,
        scope: scope,
      },
      {ctx}
    );

    token.set('sub', user._id);
    token.set('at_hash', accessToken);

    const idToken = await token.issue({use: 'idtoken'});

    ctx.body = {
      access_token: accessToken,
      expires_in: at.expiration,
      id_token: idToken,
      refresh_token: refreshToken,
      scope: at.scope,
      token_type: at.tokenType,
    };

    await next();
  } catch (err) {}
}
