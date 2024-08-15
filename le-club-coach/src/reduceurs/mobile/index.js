import { isOnMobile } from '@/utils/helper.js'

export default class MobileReduceur {

  static setPushToken (state, pushToken) {
    return {
      mobile: {
        ...state.mobile,
        pushToken,
      },
    }
  }

  static setIsOnMobile (state) {
    return {
      mobile: {
        ...state.mobile,
        isOnMobile: isOnMobile(),
      },
    }
  }

  static setIsOnIOS (state) {
    return {
      mobile: {
        ...state.mobile,
        isOnIOS: (/iPad|iPhone|iPod/).test(navigator.userAgent) && !window.MSStream,
      },
    }
  }
}
