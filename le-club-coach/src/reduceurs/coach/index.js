import { clone, get, set } from 'lodash'
import jwt from 'jsonwebtoken'
import { Cookies } from 'react-cookie'
import { intialStateCoach } from '../index.js'

export default class CoachReduceur {

  static logOutCoach () {
    const cookies = new Cookies()
    cookies.remove('googleGWP', { path: '/' })
    return {
      coach: clone(intialStateCoach),
    }
  }

  static populateCoach (state, data) {
    delete data.coach.role
    return {
      coach: {
        ...state.coach,
        ...data.coach,
      },
    }
  }

  static loginCoach (state) {
    return {
      coach: {
        ...state.coach,
        isAuthenticated: true,
      },
    }
  }

  static setCurrentMachVideo (state, data) {
    return ({
      coach: {
        ...state.coach,
        currentMatch: clone(data.match),
        currentTraining: clone(data.training),
        currentVideo: clone(data.video),
        currentCuts: clone(data.cuts),
        currentTeam: clone(data.team),
        keyTeam: clone(data.keyTeam),
        keyDays: clone(data.keyDays),
        keyMatch: clone(data.keyMatch),
      },
    })
  }

  static updateCoach (state, data) {
    const coach = Object.assign({}, state.coach, data.coach)
    const newTeams = []

    if (coach.accountType === 'T2' && coach.teamChosen && coach.teamChosen.length > 0) {
      coach.club.teams.forEach(e => {
        if (e._id === coach.teamChosen[0]) { newTeams.push(e) }
        if (e._id === coach.teamChosen[1]) { newTeams.push(e) }
      })
      coach.club.teams = newTeams
    }

    return { coach }
  }

  static hideSequencageTry (state) {
    const coach = clone(state.coach)
    coach.hideSequencageTry = true
    return { coach }
  }

  static updateCutV2 (state, data) {
    const coach = clone(state.coach)
    const cuts = [...coach.currentCuts]
    const cutIndex = cuts.findIndex(c => c._id === data._id)
    if (cutIndex >= 0) {
      cuts[cutIndex] = {
        ...cuts[cutIndex],
        ...data,
      }
    }
    coach.currentCuts = cuts
    return { coach }
  }

  static deleteCut (state, data) {
    const coach = clone(state.coach)
    coach.currentCuts.filter(c => {
      return c._id !== data.cutId
    })
    return { coach }
  }

  static updateCoachPref (state, data) {
    const coach = clone(state.coach)
    coach.prefStudio = Object.assign({}, coach.prefStudio, data.coach.prefStudio)
    return { coach }
  }

  static updateCurrentVideoDrawing (state, data) {
    const coach = clone(state.coach)
    if (data.videoDrawing.type !== 'cut') {
      set(coach, 'currentVideo.drawings', data.videoDrawing.video.drawings)
    }
    return { coach }
  }

  static updateLogoCoverCoach (state, data) {
    const coach = clone(state.coach)
    coach.urlLogo = get(data, 'coach.urlLogo')
    coach.urlCover = get(data, 'coach.urlCover')
    return { coach }
  }

  static updateStripe (state, data) {
    const coach = clone(state.coach)
    coach.stripeId = get(data, 'coach.stripeId')
    coach.cardId = get(data, 'coach.cardId')
    coach.subscribeAt = get(data, 'coach.subscribeAt')
    coach.subscribeType = get(data, 'coach.subscribeType')
    coach.accountType = get(data, 'coach.accountType')
    coach.privateActivate = get(data, 'coach.privateActivate')
    coach.cancelSubscription = get(data, 'coach.cancelSubscription')
    coach.futurAccountType = get(data, 'coach.futurAccountType')
    return { coach }
  }

  static updateCoachOption (state, data) {
    const coach = clone(state.coach)
    coach.disabledPrivateActivate = get(data, 'newCoach.disabledPrivateActivate')
    coach.privateActivate = get(data, 'newCoach.privateActivate')
    return { coach }
  }

  static parrainagePopup (state, data) {
    const coach = clone(state.coach)
    coach.parrainagePopup = data.parrainagePopup
    return { coach }
  }

  static presequencageTutorial (state, data) {
    const coach = clone(state.coach)
    coach.presequencageTutorial = data.presequencageTutorial
    return { coach }
  }
}
