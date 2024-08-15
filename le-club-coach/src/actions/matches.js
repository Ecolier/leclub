import { callApi } from '@/utils/callApi'
import store from '@/store'
import { StoreContext, connectStoreon, customContext, useStoreon } from 'storeon/react' 

export function fetchMatches (data = {}) {
  const state = store.get()
  const coachId = state.coach._id
  const { currentSeason } = state.coachSeason
  if (!currentSeason) {
    return
  }

  data.team = data.team || currentSeason.team
  data.season = data.season || currentSeason.season

  callApi(`${coachId}/matches?season=${data.season}&team=${data.team}`, 'get').then(data => {
    store.dispatch('matches/setMatches', data.matches)
  })
}

export function setMatch (data) {
  store.dispatch('matches/setMatch', {
    matchId: data.matchId,
    match: data.match,
  })
}

export function setMatchVideo (data) {
  store.dispatch('matches/setMatchVideo', data)
}

export async function getMatchSheet (matchId) {
  try {
    const state = store.get()
    const coachId = state.coach._id
    const data = await callApi(`${coachId}/match/${matchId}/sheet`, 'get')
    return data.sheet
  } catch (err) {
    store.dispatch('notifications/error', err)
  }
}

export async function fetchMatch (matchId) {
  try {
    const state = store.get()
    const coachId = state.coach._id
    const data = await callApi(`${coachId}/match/${matchId}`, 'get')
    store.dispatch('matches/setMatch', {
      matchId,
      match: data.match,
    })
  } catch (err) {
    store.dispatch(router.navigate, '/coach?mode=myMatches')
  }
}

export async function fetchMatchPlayers (matchId) {
  try {
    const state = store.get()
    const coachId = state.coach._id
    const matches = state.matches
    const match = matches[matchId] || {}
    if (match.players) {
      return
    }
    const data = await callApi(`${coachId}/match/${matchId}/players`)
    store.dispatch('matches/setMatchPlayers', {
      matchId,
      players: data.players,
    })
  } catch (err) {
    store.dispatch('notifications/error', err)
  }
}
