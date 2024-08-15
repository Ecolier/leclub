import {Schema, model, Mongoose, Types} from 'mongoose';

export const validRoles = ['Coach', 'Player', 'Supporter'] as const;
export type Role = typeof validRoles[number];

export interface Account {
  emailAddress: string;
  phoneNumber: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  profilePictureUrl?: string;
  hasMigrated?: boolean;
}

const accountModel = (validEmailAddressFormat: RegExp, validPhoneNumberFormat: RegExp) => 
  model<Account>('Account', new Schema<Account>({
    emailAddress: {required: true, type: String, unique: true, validate: validEmailAddressFormat},
    phoneNumber: {required: true, type: String, unique: true, validate: validPhoneNumberFormat},
    password: {required: true, type: String},
    firstName: {required: true, type: String},
    lastName: {required: true, type: String},
    role: {required: true, enum: validRoles, type: String },
    profilePictureUrl: String,
    hasMigrated: Boolean,
  }, { timestamps: true })
);

export type AccountModel = ReturnType<typeof accountModel>;
export default accountModel;