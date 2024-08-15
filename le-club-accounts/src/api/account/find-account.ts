import {
  ClaimsParameterMember,
  KoaContextWithOIDC,
} from 'oidc-provider';
import { AccountModel } from './account.model';

const findAccount = (AccountModel: AccountModel) => 
  async (ctx: KoaContextWithOIDC, sub: string) => {
  const user = await AccountModel.findOne(
    {_id: sub},
    {
      password: 0,
    }
  );
  return {
    accountId: sub,
    async claims(
      use: string,
      scope: string,
      claims: {[key: string]: null | ClaimsParameterMember},
      rejected: string[]
    ) {
      let scoped = {};
      if (scope.includes('profile')) {
        scoped = {
          ...scoped,
          first_name: user?.firstName,
          last_name: user?.lastName,
          role: user?.role,
          profile_picture: user?.profilePictureUrl,
        };
      }
      if (scope.includes('email')) {
        scoped = {
          ...scoped,
          email_address: user?.emailAddress,
        };
      }
      if (scope.includes('phone')) {
        scoped = {
          ...scoped,
          phone_number: user?.phoneNumber,
        };
      }
      return {
        sub,
        ...scoped,
      };
    },
  };
}

export default findAccount;
