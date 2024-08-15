import {Schema, model, Mixed} from 'mongoose';
import {AdapterPayload, ClaimsParameter} from 'oidc-provider';

export const claimsParameterSchema = new Schema<ClaimsParameter>({
  id_token: {required: true, type: Schema.Types.Mixed },
  userinfo: {required: true, type: Schema.Types.Mixed },
});

export const payloadSchema = new Schema<AdapterPayload>({
  jti: {required: false, type: String, unique: true},
  kind: {required: false, type: String},
  exp: {required: false, type: Number},
  iat: {required: false, type: Number},
  accountId: {required: false, type: String},
  clientId: {required: false, type: String},
  aud: {required: false, type: [String]},
  authTime: {required: false, type: Number},
  extra: {required: false, type: Schema.Types.Mixed},
  codeChallenge: {required: false, type: String},
  codeChallengeMethod: {required: false, type: String},
  sessionUid: {required: false, type: String},
  expiresWithSession: {required: false, type: Boolean},
  grantId: {required: false, type: String},
  nonce: {required: false, type: String},
  redirectUri: {required: false, type: String},
  resource: {required: false, type: String},
  acr: {required: false, type: String},
  amr: {required: false, type: [String]},
  scope: {required: false, type: String},
  sid: {required: false, type: String},
  jkt: {required: false, type: String},
  'x5t#S256': {required: false, type: String},
});

export interface Grantable {
  modelId: string;
  expiresAt: Date;
  payload: any;
}

export const grantableSchema = new Schema<Grantable>({
  modelId: {type: String},
  expiresAt: {type: Date, expires: 0},
  payload: {required: true, type: Object},
});

export const AccessTokenModel = model<Grantable>(
  'AccessToken',
  grantableSchema
);
export const AuthorizationCodeModel = model<Grantable>(
  'AuthorizationCode',
  grantableSchema
);
export const RefreshTokenModel = model<Grantable>(
  'RefreshToken',
  grantableSchema
);
export const InteractionModel = model<Grantable>(
  'Interaction',
  grantableSchema
);
export const SessionModel = model<Grantable>('Session', grantableSchema);
export const GrantModel = model<Grantable>('Grant', grantableSchema);

export type GrantableModel =
  | typeof AccessTokenModel
  | typeof AuthorizationCodeModel
  | typeof RefreshTokenModel
  | typeof InteractionModel
  | typeof SessionModel
  | typeof GrantModel;
