import { fromJS } from 'immutable'

export function getAnnonceTrending (state, data) {
  return state.setIn(['annonces'], fromJS(data.annoncesInfo))
}
export function getClubTrending (state, data) {
  return state.setIn(['trendingClubs'], fromJS(data.trendingClubs))
}
export function getCoachTrending (state, data) {
  return state.setIn(['trendingCoach'], fromJS(data.trendingCoach))
}

export function getVideosTrending (state, data) {
  return state.setIn(['trendingVideos'], fromJS(data.videos))
}
export function setIpAdresses (state, data) {
  return state.setIn(['ip'], fromJS(data.ip))
}
