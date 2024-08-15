import CoachReduceur from './coach/index.js'
import { intialStateCoach } from './index.js'

export default (store) => {
  store.on('@init', () => ({ coach: { ...intialStateCoach } }))
  store.on('coach/loginCoach', CoachReduceur.loginCoach)
  store.on('coach/populateCoach', CoachReduceur.populateCoach)
  store.on('coach/logOutCoach', CoachReduceur.logOutCoach)
  store.on('coach/updateCoach', CoachReduceur.updateCoach)
  store.on('coach/deleteVideo', CoachReduceur.deleteVideo)
  store.on('coach/updateVideo', CoachReduceur.updateVideo)
  store.on('coach/updateCutV2', CoachReduceur.updateCutV2)
  store.on('coach/setCurrentMachVideo', CoachReduceur.setCurrentMachVideo)
  store.on('coach/deleteCut', CoachReduceur.deleteCut)
  store.on('coach/updateCoachPref', CoachReduceur.updateCoachPref)
  store.on('coach/updateCurrentVideoDrawing', CoachReduceur.updateCurrentVideoDrawing)
  store.on('coach/sortMatch', CoachReduceur.sortMatch)
  store.on('coach/updateLogoCoverCoach', CoachReduceur.updateLogoCoverCoach)
  store.on('coach/updateStripe', CoachReduceur.updateStripe)
  store.on('coach/updateCoachOption', CoachReduceur.updateCoachOption)
  store.on('coach/hideSequencageTry', CoachReduceur.hideSequencageTry)
  store.on('coach/parrainagePopup', CoachReduceur.parrainagePopup)
  store.on('coach/presequencageTutorial', CoachReduceur.presequencageTutorial)
}
