import * as _ from 'lodash';
import {Adapter, AdapterPayload} from 'oidc-provider';
import {ClientModel} from '../client/client.model';
import {
  SessionModel,
  AccessTokenModel,
  AuthorizationCodeModel,
  GrantableModel,
  InteractionModel,
  RefreshTokenModel,
  GrantModel,
} from '../grantable.model';

export type GrantableName =
  | 'Grant'
  | 'Session'
  | 'AccessToken'
  | 'AuthorizationCode'
  | 'RefreshToken'
  | 'ClientCredentials'
  | 'Client'
  | 'InitialAccessToken'
  | 'RegistrationAccessToken'
  | 'DeviceCode'
  | 'Interaction'
  | 'ReplayDetection'
  | 'BackchannelAuthenticationRequest'
  | 'PushedAuthorizationRequest';

const availableModels: {[name: string]: GrantableModel} = {
  AccessToken: AccessTokenModel,
  AuthorizationCode: AuthorizationCodeModel,
  RefreshToken: RefreshTokenModel,
  Interaction: InteractionModel,
  Session: SessionModel,
  Grant: GrantModel,
};

const model = (name: string) => {
  const model = availableModels[name];
  if (!model) {
    throw `${name} grantable is not implemented`;
  }
  return model;
};

export class MongoAdapter implements Adapter {
  constructor(public name: string) {}

  async upsert(_id: string, payload: AdapterPayload, expiresIn: number) {
    let expiresAt;

    if (expiresIn) {
      expiresAt = new Date(Date.now() + expiresIn * 1000);
    }

    await model(this.name).updateOne(
      {modelId: _id},
      {$set: {payload, ...(expiresAt ? {expiresAt} : undefined)}},
      {upsert: true}
    );
  }

  async find(_id: string) {
    if (this.name === 'Client') {
      return await ClientModel.findOne({clientId: _id});
    }
    const grantable = await model(this.name).findOne(
      {modelId: _id},
      {payload: 1}
    );
    return grantable?.payload;
  }

  async findByUserCode(userCode: string) {
    const grantable = await model(this.name).findOne(
      {'payload.userCode': userCode},
      {payload: 1}
    );
    return grantable?.payload;
  }

  async findByUid(uid: string) {
    const grantable = await model(this.name).findOne(
      {'payload.uid': uid},
      {payload: 1}
    );
    return grantable?.payload;
  }

  async destroy(_id: string) {
    await model(this.name).deleteOne({modelId: _id});
  }

  async revokeByGrantId(grantId: string) {
    await model(this.name).deleteMany({'payload.grantId': grantId});
  }

  async consume(_id: string) {
    await model(this.name).findOneAndUpdate(
      {modelId: _id},
      {$set: {'payload.consumed': Math.floor(Date.now() / 1000)}}
    );
  }
}
