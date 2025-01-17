import {Configuration} from 'oidc-provider';
import {MongoAdapter} from './adapters/mongo.adapter';
import findAccount from './account/find-account';
import { AccountModel } from './account/account.model';
import { ClientMetadata } from 'oidc-provider';

function openIdConfig(AccountModel: AccountModel, clients: ClientMetadata[]): Configuration {
  return {
    adapter: MongoAdapter,
    clients,
    pkce: {
      methods: ['S256'],
      required: () => true,
    },
    findAccount: findAccount(AccountModel),
    interactions: {
      url(ctx, interaction) {
        if (interaction.prompt.name === 'login') {
          return `/login/${interaction.uid}`
        }
        return `/interaction/${interaction.uid}`;
      },
    },
    routes: {
      authorization: '/auth',
      backchannel_authentication: '/backchannel',
      code_verification: '/device',
      device_authorization: '/device/auth',
      end_session: '/session/end',
      introspection: '/token/introspection',
      jwks: '/jwks',
      pushed_authorization_request: '/request',
      registration: '/register',
      revocation: '/token/revocation',
      token: '/token',
      userinfo: '/me',
    },
    cookies: {
      keys: [
        'some secret key',
        'and also the old rotated away some time ago',
        'and one more',
      ],
    },
    claims: {
      email: ['email_address', 'email_address_verified'],
      phone: ['phone_number', 'phone_number_verified'],
      profile: ['first_name', 'last_name', 'nickname', 'role', 'profile_picture'],
    },
    features: {
      devInteractions: { enabled: false },
      introspection: {enabled: true},
      revocation: {enabled: true},
    },
    jwks: {
      keys: [
        {
          d: 'VEZOsY07JTFzGTqv6cC2Y32vsfChind2I_TTuvV225_-0zrSej3XLRg8iE_u0-3GSgiGi4WImmTwmEgLo4Qp3uEcxCYbt4NMJC7fwT2i3dfRZjtZ4yJwFl0SIj8TgfQ8ptwZbFZUlcHGXZIr4nL8GXyQT0CK8wy4COfmymHrrUoyfZA154ql_OsoiupSUCRcKVvZj2JHL2KILsq_sh_l7g2dqAN8D7jYfJ58MkqlknBMa2-zi5I0-1JUOwztVNml_zGrp27UbEU60RqV3GHjoqwI6m01U7K0a8Q_SQAKYGqgepbAYOA-P4_TLl5KC4-WWBZu_rVfwgSENwWNEhw8oQ',
          dp: 'E1Y-SN4bQqX7kP-bNgZ_gEv-pixJ5F_EGocHKfS56jtzRqQdTurrk4jIVpI-ZITA88lWAHxjD-OaoJUh9Jupd_lwD5Si80PyVxOMI2xaGQiF0lbKJfD38Sh8frRpgelZVaK_gm834B6SLfxKdNsP04DsJqGKktODF_fZeaGFPH0',
          dq: 'F90JPxevQYOlAgEH0TUt1-3_hyxY6cfPRU2HQBaahyWrtCWpaOzenKZnvGFZdg-BuLVKjCchq3G_70OLE-XDP_ol0UTJmDTT-WyuJQdEMpt_WFF9yJGoeIu8yohfeLatU-67ukjghJ0s9CBzNE_LrGEV6Cup3FXywpSYZAV3iqc',
          e: 'AQAB',
          kty: 'RSA',
          n: 'xwQ72P9z9OYshiQ-ntDYaPnnfwG6u9JAdLMZ5o0dmjlcyrvwQRdoFIKPnO65Q8mh6F_LDSxjxa2Yzo_wdjhbPZLjfUJXgCzm54cClXzT5twzo7lzoAfaJlkTsoZc2HFWqmcri0BuzmTFLZx2Q7wYBm0pXHmQKF0V-C1O6NWfd4mfBhbM-I1tHYSpAMgarSm22WDMDx-WWI7TEzy2QhaBVaENW9BKaKkJklocAZCxk18WhR0fckIGiWiSM5FcU1PY2jfGsTmX505Ub7P5Dz75Ygqrutd5tFrcqyPAtPTFDk8X1InxkkUwpP3nFU5o50DGhwQolGYKPGtQ-ZtmbOfcWQ',
          p: '5wC6nY6Ev5FqcLPCqn9fC6R9KUuBej6NaAVOKW7GXiOJAq2WrileGKfMc9kIny20zW3uWkRLm-O-3Yzze1zFpxmqvsvCxZ5ERVZ6leiNXSu3tez71ZZwp0O9gys4knjrI-9w46l_vFuRtjL6XEeFfHEZFaNJpz-lcnb3w0okrbM',
          q: '3I1qeEDslZFB8iNfpKAdWtz_Wzm6-jayT_V6aIvhvMj5mnU-Xpj75zLPQSGa9wunMlOoZW9w1wDO1FVuDhwzeOJaTm-Ds0MezeC4U6nVGyyDHb4CUA3ml2tzt4yLrqGYMT7XbADSvuWYADHw79OFjEi4T3s3tJymhaBvy1ulv8M',
          qi: 'wSbXte9PcPtr788e713KHQ4waE26CzoXx-JNOgN0iqJMN6C4_XJEX-cSvCZDf4rh7xpXN6SGLVd5ibIyDJi7bbi5EQ5AXjazPbLBjRthcGXsIuZ3AtQyR0CEWNSdM7EyM5TRdyZQ9kftfz9nI03guW3iKKASETqX2vh0Z8XRjyU',
          use: 'sig',
        },
        {
          crv: 'P-256',
          d: 'K9xfPv773dZR22TVUB80xouzdF7qCg5cWjPjkHyv7Ws',
          kty: 'EC',
          use: 'sig',
          x: 'FWZ9rSkLt6Dx9E3pxLybhdM6xgR5obGsj5_pqmnz5J4',
          y: '_n8G69C-A2Xl4xUW2lF0i8ZGZnk_KPYrhv4GbTGu5G4',
        },
      ],
    },
  }
};

export default openIdConfig;