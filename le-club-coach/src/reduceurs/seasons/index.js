// import { fromJS } from 'immutable'
import { clone, get, set } from 'lodash'

export default class SeasonReduceur {

  static populateSeasons (state, data) {
    if (typeof data.currentSeason === 'string') {
      data.currentSeason = data.seasons.find(s => s._id === data.currentSeason)
    }
    return {
      coachSeason: {
        ...state.coachSeason,
        currentSeason: data.currentSeason,
        seasons: data.seasons,
        adminSeason: data.adminSeason,
      },
    }
  }

  static setOnboarded (state) {
    const coachSeason = clone(state.coachSeason)
    set(coachSeason, ['currentSeason', 'onboarded', true])
    return { coachSeason }
  }

  static setSeasonCurrentTeam (state, team) {
    const coachSeason = clone(state.coachSeason)
    const currentSeason = get(coachSeason, 'currentSeason', {})
    currentSeason.team = team

    // we update our seasons array with the new currentSeason
    coachSeason.seasons = get(coachSeason, 'seasons', []).map(s => {
      if (currentSeason._id === s._id) {
        return currentSeason
      }
      return s
    })

    return { coachSeason }
  }

  static changeCurrentSeason (state, data) {
    const coachSeason = clone(state.coachSeason)
    const seasons = get(coachSeason, 'seasons', [])
    const currentSeason = seasons.find(s => s.season === data.season)
    if (!currentSeason) {
      return state
    }
    coachSeason.currentSeason = currentSeason
    return { coachSeason }
  }

  static setSeason (state, data) {
    if (data === undefined) {
      return
    }

    const coachSeason = clone(state.coachSeason)
    const seasons = get(coachSeason, 'seasons', [])
    const currentSeason = get(coachSeason, 'currentSeason', {})
    const newSeason = data.season

    const index = seasons.findIndex(s => s.season === newSeason.season)
    if (index >= 0) {
      seasons[index] = newSeason
    } else {
      seasons.push(newSeason)
    }

    if (currentSeason.season === newSeason.season) {
      coachSeason.currentSeason = newSeason
    }

    return { coachSeason }
  }

}
