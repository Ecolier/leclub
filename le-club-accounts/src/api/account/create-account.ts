import { AccountModel, validRoles } from './account.model';
import * as bcrypt from 'bcrypt';
import * as _ from 'lodash'
import { RegistrationCredentials } from "./registration-credentials.model";
import uploadProfilePicture from './upload-profile-picture';
import mongoose from 'mongoose';
import { DuplicateAccountError, InvalidFormatError, InvalidRoleError } from './account.errors';

export interface CreateAccountOptions {
  validPasswordFormat: RegExp;
}

async function createAccount(
  registrationProps: RegistrationCredentials, 
  AccountModel: AccountModel,
  options: CreateAccountOptions) {
    const { emailAddress, phoneNumber, password, firstName, lastName, role, profilePicture } = registrationProps;
    const _id = new mongoose.Types.ObjectId();
    let profilePictureUrl;
    if (profilePicture) {
      profilePictureUrl = await uploadProfilePicture(_id.toHexString(), profilePicture);
    }
    if (!options.validPasswordFormat.test(password)) {
      throw new InvalidFormatError(['password']);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      await new AccountModel({
        _id, firstName, lastName, emailAddress, phoneNumber, role,
        ...(profilePictureUrl && { profilePictureUrl }),
        password: hashedPassword,
      }).save();
    } catch(err: any) {
      if (err instanceof mongoose.Error.ValidationError) {
        throw new InvalidFormatError(Object.keys(err.errors))
      }
      
      // Code 11000 is the mongoDB error for duplicate field.
      if (err.code === 11000) {
        const errorKeyValue = Object.entries<string>(err.keyValue)[0];
        throw new DuplicateAccountError(errorKeyValue[0], errorKeyValue[1]);
      }
    }
  }
  
  export default createAccount;