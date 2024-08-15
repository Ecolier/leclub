import MatchesReduceur from './matches/index.js'

export default (store) => {
  store.on('@init', () => ({ matches: {} }))
  store.on('matches/setMatches', MatchesReduceur.setMatches)
  store.on('matches/setMatchVideo', MatchesReduceur.setMatchVideo)
  store.on('matches/updateMatchVideo', MatchesReduceur.updateMatchVideo)
  store.on('matches/setMatchVideoWhitelist', MatchesReduceur.setMatchVideoWhitelist)
  store.on('matches/setMatchUploadState', MatchesReduceur.setMatchUploadState)
  store.on('matches/removeMatchUploadState', MatchesReduceur.removeMatchUploadState)
  store.on('matches/setMatch', MatchesReduceur.setMatch)
  store.on('matches/setMatchPlayers', MatchesReduceur.setMatchPlayers)
}