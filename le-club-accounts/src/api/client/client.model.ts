import {Schema, model} from 'mongoose';

export const responseTypes = [
  'code',
  'id_token',
  'code id_token',
  'id_token token',
  'code token',
  'code id_token token',
  'none',
];
export const applicationTypes = ['web', 'native'];

export interface Client {
  clientId: string;
  redirectUris: string[];
  grantTypes: string[];
  responseTypes: string[];
  applicationType: string;
  clientName: string;
  scope: string;
}

const clientSchema = new Schema<Client>({
  clientId: {required: true, type: String, unique: true},
  redirectUris: {required: true, type: [String]},
  grantTypes: {required: true, type: [String]},
  responseTypes: {required: true, type: [String], enum: responseTypes},
  applicationType: {required: true, type: String, enum: applicationTypes},
  clientName: {required: true, type: String},
  scope: {required: false, type: String},
});

clientSchema.set('timestamps', true);

export const ClientModel = model<Client>('Client', clientSchema);
