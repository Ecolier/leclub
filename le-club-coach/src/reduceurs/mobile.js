import MobileReduceur from './mobile/index.js'
import { initialStateMobile } from './index.js'

export default (store) => {
  store.on('@init', () => ({ mobile: { ...initialStateMobile } }))
  store.on('mobile/setPushToken', MobileReduceur.setPushToken)
  store.on('mobile/setIsOnMobile', MobileReduceur.setIsOnMobile)
  store.on('mobile/setIsOnIOS', MobileReduceur.setIsOnIOS)
}
